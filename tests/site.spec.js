import { test, expect } from './test-tools.js';

const pages = [
  'index',
  'maternity',
  'studio-baby',
  'at-home-baby',
  'family-photography',
  'know-me',
  'contact',
  'blog',
  'experience',
];

test.beforeEach(async ({ page }) => {
  // External font servers are not part of these local regression tests.
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
});

async function dismissCookies(page) {
  const accept = page.locator('#cookie-accept');
  if (await accept.isVisible()) await accept.click();
}

for (const width of [390, 1440]) {
  for (const name of pages) {
    test(`${name}: resources and layout at ${width}px in a subfolder`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = [];
      const missing = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => {
        if (
          response.url().startsWith('http://127.0.0.1:4173') &&
          response.status() >= 400
        )
          missing.push(response.url());
      });
      await page.goto(`/preview/${name}.html`);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('.nav--enhanced')).toHaveCount(1);
      await expect(page.locator('.nav__link')).toHaveCount(8);
      await page.locator('img').evaluateAll(async (images) => {
        await Promise.all(
          images.map(async (image) => {
            image.loading = 'eager';
            try {
              await image.decode();
            } catch {
              /* Assert failed images below. */
            }
          }),
        );
      });
      const broken = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((image) => !image.naturalWidth)
            .map((image) => image.src),
        );
      expect(broken).toEqual([]);
      expect(missing).toEqual([]);
      expect(errors).toEqual([]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    });
  }
}

test('menu keeps focus inside, closes on Escape, and hides closed links', async ({
  page,
}) => {
  await page.goto('/index.html');
  await dismissCookies(page);
  const nav = page.locator('.nav');
  const burger = page.locator('.header__burger-btn');
  await expect(nav).toHaveAttribute('inert', '');
  await burger.click();
  await expect(page.locator('.nav__close-btn')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.nav__link').last()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.nav__close-btn')).toBeFocused();
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  await expect(page.locator('.nav__link--no-underline')).toHaveText('Blog');
  await page.keyboard.press('Escape');
  await expect(burger).toBeFocused();
  await expect(nav).toHaveAttribute('inert', '');
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
});

test('failed navigation and testimonials do not break other components', async ({
  page,
}) => {
  await page.route('**/data/*.json', (route) =>
    route.fulfill({ status: 503, body: 'Unavailable' }),
  );
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/preview/index.html');
  await expect(page.locator('.testimonials__slider')).toContainText(
    'temporarily unavailable',
  );
  await expect(page.locator('#cookie-accept')).toBeVisible();
  await dismissCookies(page);
  await page.locator('.header__burger-btn').click();
  await expect(page.locator('.nav__link')).toHaveCount(8);
  await page.keyboard.press('Escape');
  await expect(page.locator('.memories__btn--next')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const [name, block] of [
  ['maternity', 'maternity-questions'],
  ['studio-baby', 'studio-baby-questions'],
  ['at-home-baby', 'at-home-baby-questions'],
  ['know-me', 'know-me'],
]) {
  test(`${name}: FAQ closes siblings and fits after resize`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${name}.html`);
    await dismissCookies(page);
    const buttons = page.locator(`.${block}__header`);
    await buttons.first().click();
    const panel = page.locator(
      `#${await buttons.first().getAttribute('aria-controls')}`,
    );
    await expect(panel).toBeVisible();
    await buttons.nth(1).click();
    await expect(panel).toBeHidden();
    const second = page.locator(
      `#${await buttons.nth(1).getAttribute('aria-controls')}`,
    );
    await page.setViewportSize({ width: 360, height: 800 });
    await expect(second).toBeVisible();
    expect(
      await second.evaluate(
        (element) => element.scrollHeight <= element.clientHeight + 1,
      ),
    ).toBe(true);
  });
}

test('expanded blog article uses natural height on mobile', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog.html');
  await dismissCookies(page);
  const button = page.locator('.post-card__read-more').first();
  await button.click();
  await expect(button).toContainText('Close Article');
  await page.setViewportSize({ width: 360, height: 800 });
  const panel = page.locator('.post-card__full-content').first();
  expect(
    await panel.evaluate(
      (element) => element.scrollHeight <= element.clientHeight + 1,
    ),
  ).toBe(true);
  await button.click();
  await expect(panel).toBeHidden();
});

test('footer logo navigates home from a subpage', async ({ page }) => {
  await page.goto('/preview/contact.html');
  await dismissCookies(page);
  await page.locator('.footer__logo-link').click();
  await expect(page).toHaveURL(/\/preview\/index\.html$/);
});

test('Meet Patrice animations do not accumulate state class names', async ({
  page,
}) => {
  await page.goto('/know-me.html');
  await dismissCookies(page);
  const tile = page.locator('.navigation-tiles__tile').first();
  await tile.scrollIntoViewIfNeeded();
  await expect(tile).toHaveClass(/navigation-tiles__tile--visible/);
  await page.evaluate(() => scrollTo(0, 0));
  await tile.scrollIntoViewIfNeeded();
  expect(await tile.getAttribute('class')).not.toContain('--visible--visible');
});

for (const [name, block] of [
  ['index', 'memories'],
  ['maternity', 'maternity-slideshow'],
  ['studio-baby', 'studio-baby-slideshow'],
  ['at-home-baby', 'at-home-baby-slideshow'],
  ['family-photography', 'family-page-slideshow'],
]) {
  test(`${block}: next/previous work with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${name}.html`);
    await dismissCookies(page);
    const track = page.locator(`.${block}__carousel`);
    const first = () =>
      track.evaluate((element) =>
        element.firstElementChild.querySelector('img').getAttribute('src'),
      );
    const initial = await first();
    await page.locator(`.${block}__btn--next`).click();
    expect(await first()).not.toBe(initial);
    await page.locator(`.${block}__btn--prev`).click();
    expect(await first()).toBe(initial);
    expect(await track.evaluate((element) => element.style.transform)).toMatch(
      /translateX/,
    );
  });
}

test('hover still pauses autoplay after a previous click timeout expires', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/maternity.html');
  await dismissCookies(page);
  const track = page.locator('.maternity-slideshow__carousel');
  await page.locator('.maternity-slideshow__btn--next').click();
  await page.clock.runFor(600);
  await track.hover();
  const first = await track.evaluate(
    (element) => element.firstElementChild.querySelector('img').src,
  );
  await page.clock.runFor(10000);
  expect(
    await track.evaluate(
      (element) => element.firstElementChild.querySelector('img').src,
    ),
  ).toBe(first);
});

for (const width of [390, 1440]) {
  test(`memories: animated steps do not drift at ${width}px`, async ({
    page,
  }) => {
    await page.clock.install();
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/index.html');
    await dismissCookies(page);
    const track = page.locator('.memories__carousel');
    const position = () =>
      track.evaluate((element) => ({
        src: element.firstElementChild.querySelector('img').src,
        left: element.firstElementChild.offsetLeft,
        transform: element.style.transform,
      }));
    const initial = await position();
    const next = page.locator('.memories__btn--next');
    const previous = page.locator('.memories__btn--prev');
    for (let index = 0; index < 3; index++) {
      await next.click();
      await page.clock.runFor(600);
      await previous.click();
      await page.clock.runFor(600);
      expect(await position()).toEqual(initial);
    }
  });
}

test('reduced motion disables autoplay without disabling manual navigation', async ({
  page,
}) => {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/maternity.html');
  await dismissCookies(page);
  const track = page.locator('.maternity-slideshow__carousel');
  const first = () =>
    track.evaluate(
      (element) => element.firstElementChild.querySelector('img').src,
    );
  const initial = await first();
  await page.clock.runFor(12000);
  expect(await first()).toBe(initial);
  await page.locator('.maternity-slideshow__btn--next').click();
  expect(await first()).not.toBe(initial);
});

test('testimonials use the shared next/previous controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html');
  await dismissCookies(page);
  const first = page.locator('.testimonials__card').first();
  await expect(first).toContainText('Miranda');
  await page.locator('.testimonials__btn--next').click();
  await expect(first).toContainText('Lily');
  await page.locator('.testimonials__btn--prev').click();
  await expect(first).toContainText('Miranda');
});

test('form without endpoint cannot submit personal data to the current URL', async ({
  page,
}) => {
  await page.goto('/contact.html');
  await expect(page.locator('.form__btn')).toBeDisabled();
  await expect(page.locator('#contact-form-status')).toContainText(
    'not accepting messages',
  );
  await page
    .locator('.contact__form')
    .evaluate((form) =>
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      ),
    );
  await expect(page).toHaveURL(/\/contact\.html$/);
});

test('configured form reports success and failure without losing fields on failure', async ({
  page,
}) => {
  await page.route('**/contact.html', async (route) => {
    const response = await route.fetch();
    const html = (await response.text()).replace(
      'data-endpoint=""',
      'data-endpoint="/test-message"',
    );
    await route.fulfill({ response, body: html });
  });
  let success = false;
  await page.route('**/test-message', (route) =>
    route.fulfill({
      status: success ? 200 : 500,
      contentType: 'application/json',
      body: '{}',
    }),
  );
  await page.goto('/contact.html');
  await dismissCookies(page);
  await page.locator('#first-name').fill('Test');
  await page.locator('#last-name').fill('Visitor');
  await page.locator('#email').fill('visitor@example.com');
  await page.locator('#source').selectOption('google');
  await page.locator('.form__btn').click();
  await expect(page.locator('#contact-form-status')).toContainText(
    'could not be sent',
  );
  await expect(page.locator('#first-name')).toHaveValue('Test');
  success = true;
  await page.locator('.form__btn').click();
  await expect(page.locator('#contact-form-status')).toContainText(
    'has been sent',
  );
  await expect(page.locator('#first-name')).toHaveValue('');
});

test('unavailable browser storage does not break the cookie banner', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage blocked');
      },
    });
  });
  await page.goto('/index.html');
  await expect(page.locator('#cookie-accept')).toBeVisible();
  await page.locator('#cookie-accept').click();
  await expect(page.locator('#cookie-banner')).toHaveClass(
    /cookie-banner--hidden/,
  );
});

test('content and navigation remain available with JavaScript disabled', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
  await page.goto('http://127.0.0.1:4173/preview/know-me.html');
  await expect(page.locator('.nav__link').first()).toBeVisible();
  await expect(page.locator('.presentation__text-wrapper')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.presentation__img--first')).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.navigation-tiles__tile').first()).toHaveCSS(
    'opacity',
    '1',
  );
  await expect(page.locator('.know-me__content').first()).toBeVisible();
  await context.close();
});
