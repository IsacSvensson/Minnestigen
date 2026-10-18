import { expect, test } from '@playwright/test';
import { openParent, setup } from './helpers';

test('a grown-up chooses a code, adds a school list, and it comes first in Göm och säg', async ({ page }) => {
  await setup(page);
  await openParent(page);

  await page.getByLabel('Listans namn').fill('Glosor v.43');
  await page.getByLabel('Kort').fill('hund = dog\nkatt = cat\nbara text\nko = cow');
  await page.getByRole('button', { name: 'Lägg till 3 kort' }).click();
  await expect(page.getByText('Glosor v.43')).toBeVisible();

  await page.getByLabel('Steg på stigen').selectOption('1');
  await page.getByRole('button', { name: 'Tillbaka' }).click();

  await page.getByRole('button', { name: 'Gå stigen' }).click();
  await expect(page.locator('.flashcard__prompt')).toHaveText('hund');
});

test('the wrong code keeps the grown-ups view closed', async ({ page }) => {
  await setup(page);
  await openParent(page, '1234');
  await page.getByRole('button', { name: 'Tillbaka' }).click();
  await page.getByRole('button', { name: 'För vuxna' }).click();
  for (const d of '0000') await page.locator('.pin-keys').getByRole('button', { name: d, exact: true }).click();
  await expect(page.getByText('Fel kod. Försök igen.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Skolkopplingen' })).toHaveCount(0);
});

test('deleting all data starts over', async ({ page }) => {
  await setup(page);
  await openParent(page);
  page.once('dialog', (d) => void d.accept());
  await page.getByRole('button', { name: 'Radera all data' }).click();
  await expect(page.getByLabel('Barnets namn eller smeknamn')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Barnets namn eller smeknamn')).toBeVisible();
});
