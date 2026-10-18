import { expect, test } from '@playwright/test';
import { playStepZero, setup, stored } from './helpers';

test('a new child plays Gissa och pröva, lights lanterns and moves on to Göm och säg', async ({ page }) => {
  await setup(page);
  await expect(page.getByRole('img', { name: 'Mönsterskogen, 0 av 8 lyktor tända' })).toBeVisible();

  await playStepZero(page, { guess: 4, remember: 3 });
  await expect(page.getByRole('heading', { name: 'I morgon kollar vi vad du minns!' })).toBeVisible();
  await page.getByRole('button', { name: 'Tillbaka till skogen' }).click();
  await expect(page.getByRole('img', { name: 'Mönsterskogen, 1 av 8 lyktor tända' })).toBeVisible();

  // Two rounds and "you can do something to remember" complete step 0.
  await playStepZero(page);
  await page.getByRole('button', { name: 'Tillbaka till skogen' }).click();
  await expect.poll(async () => (await stored(page))?.profile?.currentStep).toBe(1);

  // Steg 1: titta on five cards, then göm och säg.
  await page.getByRole('button', { name: 'Gå stigen igen' }).click();
  await expect(page.getByText('Steg 1 · Plocka fram')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Titta' })).toBeVisible();
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Nästa' }).click();
  await expect(page.getByRole('heading', { name: 'Göm och säg' })).toBeVisible();
  await expect(page.getByText('gömt')).toBeVisible();

  // The hint ladder: first letter, then the answer is always shown after the attempt.
  await page.getByRole('button', { name: 'Ledtråd' }).click();
  await expect(page.getByText('Börjar på:')).toBeVisible();
  await page.getByRole('button', { name: 'apple', exact: true }).click();
  await expect(page.getByText('Rätt med lite hjälp.')).toBeVisible();
  await page.getByRole('button', { name: 'Vidare' }).click();

  // Saying it aloud: the answer opens and the child checks it.
  await page.getByRole('button', { name: 'Jag säger högt' }).click();
  await expect(page.locator('.flashcard__flap--open')).toHaveText('fish');
  await page.getByRole('button', { name: 'Ja, rätt!' }).click();
  await expect(page.getByText('Du plockade fram det själv!')).toBeVisible();
});

test('the layout never scrolls sideways', async ({ page }) => {
  await setup(page);
  const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  expect(await fits()).toBe(true);
  await page.getByRole('button', { name: 'Gå stigen' }).click();
  expect(await fits()).toBe(true);
});
