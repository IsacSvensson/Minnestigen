import { expect, test } from '@playwright/test';
import { setup } from './helpers';

test('works fully offline after the first visit, without any outside traffic', async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign: string[] = [];
  context.on('request', (r) => {
    if (!r.url().startsWith(origin) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) foreign.push(r.url());
  });

  // First visit: the service worker installs and caches the app.
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await context.setOffline(true);
  await setup(page);
  await page.getByRole('button', { name: 'Gå stigen' }).click();
  await expect(page.getByRole('button', { name: 'Klar', exact: true })).toBeVisible();
  expect(foreign).toEqual([]);
});
