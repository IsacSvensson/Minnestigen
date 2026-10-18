import { expect, test } from '@playwright/test';
import { pickPictures, playStepZero, setup, stored } from './helpers';

test('pictures come back as retrieval a week later, and the child sees long-term memory', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-01T10:00:00') });
  await setup(page);
  const shown = await playStepZero(page, { insight: false });
  await page.getByRole('button', { name: 'Tillbaka till skogen' }).click();
  await expect.poll(async () => (await stored(page))?.sessionsCompleted).toBe(1);

  // Nothing is due the same day.
  await expect(page.getByText('väntar på att plockas fram')).toHaveCount(0);

  await page.clock.setSystemTime(new Date('2026-10-08T10:00:00'));
  await page.reload();
  await expect(page.getByText('1 sak väntar på att plockas fram')).toBeVisible();

  await page.getByRole('button', { name: 'Gå stigen igen' }).click();
  await expect(page.getByRole('heading', { name: 'Plocka fram' })).toBeVisible();
  await expect(page.getByText('Minns du bilderna från förra gången?')).toBeVisible();
  await pickPictures(page, shown);
  await expect(page.getByText('Du hittade 6 av 6')).toBeVisible();
  await page.getByRole('button', { name: 'Vidare' }).click();

  await playStepZeroTool(page);
  await expect(page.getByRole('heading', { name: 'Du kom ihåg 6 av 6 från förra veckan!' })).toBeVisible();
});

/** Today's tool after the warm-up, without starting from the forest. */
async function playStepZeroTool(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Klar', exact: true }).click();
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Det är min gissning' }).click();
  await page.getByRole('button', { name: 'Nu kör vi!' }).click();
  await page.locator('.picture-grid button').first().click();
  await page.getByRole('button', { name: 'Kolla' }).click();
  await page.getByRole('button', { name: 'Vidare' }).click();
  await page.getByRole('button', { name: 'Vet inte' }).click();
  await page.getByRole('button', { name: 'Inget särskilt' }).click();
}
