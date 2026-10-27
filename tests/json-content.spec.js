import { readFileSync } from 'node:fs';
import { test, expect } from './test-tools.js';

const fixture = (name) =>
  JSON.parse(
    readFileSync(new URL(`../data/${name}.json`, import.meta.url), 'utf8'),
  );

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  await page.addInitScript(() => localStorage.setItem('cookieConsent', 'true'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('FAQ is rendered from JSON, escapes text, and opens new answers', async ({
  page,
}) => {
  const question = 'Can I bring <img src=x onerror=alert(1)>?';
  await page.route('**/data/faqs.json', (route) =>
    route.fulfill({
      json: {
        'studio-baby-questions': [
          {
            id: 'bring-a-blanket',
            question,
            answer: [
              'Yes, bring your favourite blanket.',
              'We will include it in the session.',
            ],
          },
          {
            id: 'bring-a-toy',
            question: 'Can I bring a toy?',
            answer: ['Yes.'],
          },
        ],
      },
    }),
  );
  await page.goto('/preview/studio-baby.html');
  const list = page.locator('[data-json-faq]');
  await expect(list).toHaveAttribute('data-content-source', 'json');
  await expect(list.locator('article')).toHaveCount(2);
  await expect(list.locator('img')).toHaveCount(0);
  // Decorative + is aria-hidden, so the question alone is the accessible name.
  const header = list.getByRole('button', { name: question, exact: true });
  await header.click();
  await expect(page.locator('#bring-a-blanket')).toBeVisible();
  await expect(page.locator('#bring-a-blanket p')).toHaveCount(2);
  await list
    .getByRole('button', { name: 'Can I bring a toy?', exact: true })
    .click();
  await expect(page.locator('#bring-a-blanket')).toBeHidden();
  await expect(page.locator('#bring-a-toy')).toBeVisible();
});

test('a late FAQ response preserves the opened question and keyboard focus', async ({
  page,
}) => {
  const faqs = fixture('faqs');
  faqs['studio-baby-questions'][0].answer = ['Updated answer from JSON.'];
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/data/faqs.json', async (route) => {
    await gate;
    await route.fulfill({ json: faqs });
  });
  await page.goto('/studio-baby.html');
  const header = page.locator('.studio-baby-questions__header').first();
  await header.click();
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  release();
  await expect(page.locator('[data-json-faq]')).toHaveAttribute(
    'data-content-source',
    'json',
  );
  await expect(header).toBeFocused();
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#studio-baby-questions-1')).toHaveText(
    'Updated answer from JSON.',
  );
});

test('session packages load names, prices, features and booking links from JSON', async ({
  page,
}) => {
  const packages = fixture('session-packages');
  packages[0] = {
    ...packages[0],
    name: 'Weekend & Family Session',
    price: 275.5,
    featured: true,
    features: ['One-hour session', 'Ten edited photos'],
    booking: {
      label: 'Reserve this session',
      url: 'contact.html?session=weekend',
    },
  };
  await page.route('**/data/session-packages.json', (route) =>
    route.fulfill({ json: [packages[0]] }),
  );
  await page.goto('/preview/experience.html');
  const grid = page.locator('[data-json-packages]');
  await expect(grid).toHaveAttribute('data-content-source', 'json');
  await expect(grid.locator('.package-card')).toHaveCount(1);
  await expect(grid.locator('.package-card--featured')).toHaveCount(1);
  await expect(grid.locator('.package-card__name')).toHaveText(
    'Weekend & Family Session',
  );
  await expect(grid.locator('.package-card__price')).toHaveText('$275.50');
  await expect(grid.locator('.package-card__features li')).toHaveCount(2);
  await expect(
    grid.getByRole('link', { name: 'Reserve this session' }),
  ).toHaveAttribute('href', 'contact.html?session=weekend');
});

test('both contact option lists share one JSON request and keep submitted values', async ({
  page,
}) => {
  const options = fixture('contact-options');
  options['session-type'].push({
    value: 'mini-session',
    label: 'Mini photo session',
  });
  options.source.push({ value: 'newsletter', label: 'Email newsletter' });
  let requests = 0;
  await page.route('**/data/contact-options.json', (route) => {
    requests++;
    return route.fulfill({ json: options });
  });
  await page.goto('/preview/contact.html');
  await expect(page.locator('[data-content-source="json"]')).toHaveCount(2);
  await page.locator('#session-type').selectOption('mini-session');
  await page.locator('#source').selectOption('newsletter');
  expect(
    await page.locator('.contact__form').evaluate((form) => {
      const data = new FormData(form);
      return [data.get('session-type'), data.get('source')];
    }),
  ).toEqual(['mini-session', 'newsletter']);
  expect(requests).toBe(1);
});

test('late option loading preserves the selection already made by the visitor', async ({
  page,
}) => {
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route('**/data/contact-options.json', async (route) => {
    await gate;
    await route.fulfill({ json: fixture('contact-options') });
  });
  await page.goto('/contact.html');
  await page.locator('#session-type').selectOption('birthday');
  await page.locator('#source').selectOption('google');
  release();
  await expect(page.locator('[data-content-source="json"]')).toHaveCount(2);
  await expect(page.locator('#session-type')).toHaveValue('birthday');
  await expect(page.locator('#source')).toHaveValue('google');
});

for (const failure of ['http', 'syntax', 'schema']) {
  test(`HTML content stays usable after a ${failure} JSON failure`, async ({
    page,
  }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route(
      /\/data\/(faqs|session-packages|contact-options)\.json$/,
      (route) => {
        if (failure === 'http')
          return route.fulfill({ status: 503, body: 'Unavailable' });
        if (failure === 'syntax')
          return route.fulfill({
            contentType: 'application/json',
            body: '{broken',
          });
        return route.fulfill({ json: { invalid: true } });
      },
    );
    await page.goto('/studio-baby.html');
    await expect(page.locator('[data-json-faq]')).toHaveAttribute(
      'data-content-source',
      'html',
    );
    await page.locator('.studio-baby-questions__header').first().click();
    await expect(page.locator('#studio-baby-questions-1')).toBeVisible();
    await page.goto('/experience.html');
    await expect(page.locator('[data-json-packages]')).toHaveAttribute(
      'data-content-source',
      'html',
    );
    await expect(page.locator('.package-card')).toHaveCount(3);
    await expect(page.locator('.package-card__price').first()).toHaveText(
      '$350',
    );
    await page.goto('/contact.html');
    await expect(page.locator('[data-content-source="html"]')).toHaveCount(2);
    await page.locator('#source').selectOption('google');
    await expect(page.locator('#source')).toHaveValue('google');
    expect(errors).toEqual([]);
  });
}

test('generated FAQ, packages and contact options work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/preview/studio-baby.html');
    await expect(page.locator('#studio-baby-questions-1')).toBeVisible();
    await page.goto('http://127.0.0.1:4173/preview/experience.html');
    await expect(page.locator('.package-card')).toHaveCount(3);
    await expect(page.locator('.package-card__price').first()).toHaveText(
      '$350',
    );
    await page.goto('http://127.0.0.1:4173/preview/contact.html');
    await page.locator('#session-type').selectOption('birthday');
    await expect(page.locator('#session-type')).toHaveValue('birthday');
  } finally {
    await context.close();
  }
});
