import { expect, type Page } from '@playwright/test';

/** First start: a guardian fills in the child and consents. Ends on the forest. */
export async function setup(page: Page, name = 'Alva'): Promise<void> {
  await page.goto('/');
  await page.getByLabel('Barnets namn eller smeknamn').fill(name);
  await page.getByLabel('Jag är vårdnadshavare och godkänner att barnet använder appen.').check();
  await page.getByRole('button', { name: 'Börja' }).click();
  await expect(page.getByRole('heading', { name: `Hej ${name}!` })).toBeVisible();
}

/** The names of the pictures on screen, in order. */
export function pictureNames(page: Page): Promise<string[]> {
  return page.locator('.picture-grid .tile svg').evaluateAll((svgs) => svgs.map((s) => s.getAttribute('aria-label') ?? ''));
}

/** Picks pictures in the recognition grid by name and checks the answer. */
export async function pickPictures(page: Page, names: string[]): Promise<void> {
  for (const name of names) await page.locator('.picture-grid').getByRole('button', { name, exact: true }).click();
  await page.getByRole('button', { name: 'Kolla' }).click();
}

/**
 * Plays Gissa och pröva from the forest through the reflection. Returns the pictures shown.
 * `remember` is how many of them the child picks correctly.
 */
export async function playStepZero(page: Page, { guess = 4, remember = 6, insight = true } = {}): Promise<string[]> {
  await page.getByRole('button', { name: /^Gå stigen/ }).click();
  await finishWarmupIfAny(page);
  const shown = await pictureNames(page);
  await page.getByRole('button', { name: 'Klar', exact: true }).click();
  await page.getByRole('button', { name: String(guess), exact: true }).click();
  await page.getByRole('button', { name: 'Det är min gissning' }).click();
  await page.getByRole('button', { name: 'Nu kör vi!' }).click();
  await pickPictures(page, shown.slice(0, remember));
  await expect(page.getByText(`Du hittade ${remember} av 6`)).toBeVisible();
  await page.getByRole('button', { name: 'Vidare' }).click();
  await page.getByRole('button', { name: insight ? 'Ja!' : 'Vet inte' }).click();
  await page.getByRole('button', { name: 'Inget särskilt' }).click();
  return shown;
}

/** Earlier picture sets that are due come first; this answers them all wrong-free by picking nothing useful. */
async function finishWarmupIfAny(page: Page): Promise<void> {
  while (await page.getByRole('heading', { name: 'Plocka fram' }).isVisible()) {
    await page.locator('.picture-grid button').first().click();
    await page.getByRole('button', { name: 'Kolla' }).click();
    await page.getByRole('button', { name: 'Vidare' }).click();
  }
}

/** The app document as stored in IndexedDB. */
export function stored(page: Page): Promise<{ sessionsCompleted: number; profile: { currentStep: number } | null } | undefined> {
  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const open = indexedDB.open('minnesstigen');
        open.onsuccess = () => {
          const get = open.result.transaction('state').objectStore('state').get('app');
          get.onsuccess = () => {
            resolve(get.result);
            open.result.close();
          };
        };
      }),
  );
}

/** Opens the grown-ups' view, choosing the code the first time. */
export async function openParent(page: Page, pin = '1234'): Promise<void> {
  await page.getByRole('button', { name: 'För vuxna' }).click();
  const first = await page.getByRole('heading', { name: 'Välj en vuxenkod' }).isVisible();
  const typePin = async () => {
    for (const d of pin) await page.locator('.pin-keys').getByRole('button', { name: d, exact: true }).click();
  };
  await typePin();
  if (first) await typePin();
  await expect(page.getByRole('heading', { name: 'Skolkopplingen' })).toBeVisible();
}
