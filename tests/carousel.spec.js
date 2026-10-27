import { test, expect } from './test-tools.js';

test.beforeEach(async ({ page }) => {
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) =>
    route.abort(),
  );
});

for (const width of [390, 1440]) {
  test(`Studio Baby moves forward and back with animation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/studio-baby.html');
    await page.locator('#cookie-accept').click();
    const track = page.locator('.studio-baby-slideshow__carousel');
    const first = () =>
      track.evaluate(
        (element) => element.firstElementChild.querySelector('img').src,
      );
    const initial = await first();
    await page.locator('.studio-baby-slideshow__btn--next').click();
    await expect.poll(first).not.toBe(initial);
    await page.locator('.studio-baby-slideshow__btn--prev').click();
    await expect.poll(first).toBe(initial);
  });
}

test('Studio Baby advances automatically with the pointer outside', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/studio-baby.html');
  await page.locator('#cookie-accept').click();
  const track = page.locator('.studio-baby-slideshow__carousel');
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const initial = await track.evaluate(
    (element) => element.firstElementChild.querySelector('img').src,
  );
  await page.clock.runFor(4000);
  expect(
    await track.evaluate(
      (element) => element.firstElementChild.querySelector('img').src,
    ),
  ).not.toBe(initial);
});

test('Studio Baby resumes after a pointer click on an arrow', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/studio-baby.html');
  await page.locator('#cookie-accept').click();
  const track = page.locator('.studio-baby-slideshow__carousel');
  await page.locator('.studio-baby-slideshow__btn--next').click();
  await page.clock.runFor(600);
  const initial = await track.evaluate(
    (element) => element.firstElementChild.querySelector('img').src,
  );
  await page.clock.runFor(6000);
  expect(
    await track.evaluate(
      (element) => element.firstElementChild.querySelector('img').src,
    ),
  ).not.toBe(initial);
});

test('Studio Baby pauses for keyboard focus and resumes when focus leaves', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/studio-baby.html');
  await page.locator('#cookie-accept').click();
  await page.mouse.move(0, 0);
  await page.locator('.studio-baby-slideshow__btn--prev').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('.studio-baby-slideshow__btn--next')).toBeFocused();
  const track = page.locator('.studio-baby-slideshow__carousel');
  const first = () =>
    track.evaluate(
      (element) => element.firstElementChild.querySelector('img').src,
    );
  const initial = await first();
  await page.clock.runFor(5000);
  expect(await first()).toBe(initial);
  await page.keyboard.press('Tab');
  await page.clock.runFor(4000);
  expect(await first()).not.toBe(initial);
});
