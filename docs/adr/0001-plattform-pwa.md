# ADR 0001 – Plattform: klient-only PWA i vanilla TypeScript, publicerad på GitHub Pages

**Status:** Beslutad (2026-10-18). Ersätter första utkastet (React).

## Sammanhang
Version 1 ska räcka för att pröva kärnan i en pilot med barn 6–12 år, i skolan (ofta
surfplattor) och hemma (föräldrars telefoner). Integritet kräver att data stannar på
enheten. Systerprojektet **Mattedalen** (IsacSvensson/Mattedalen) har redan en beprövad
uppsättning för exakt detta: statisk klientapp, offline, IndexedDB, GitHub Pages.

## Beslut
- **Bara klient.** Ingen server, inget konto. Appen är statiska filer (HTML, CSS, JS).
- **Vanilla TypeScript utan ramverk**, kompilerat till JavaScript med Vite. Skärmar byggs
  med små DOM-hjälpare (`h()`, `s()`, `fill()` i `src/shell/dom.ts`) och byts med
  `show()` – samma mönster som Mattedalen.
- **PWA:** installérbar, fungerar helt offline via en egen service worker
  (`src/sw/sw-template.js`; byggsteget fyller i fillista och version).
- **Publicering:** GitHub Pages via Actions (`.github/workflows/deploy.yml`) från
  standardgrenen. `base: './'` gör att bygget fungerar under `/Minnestigen/`.
- Samma ursprung som Mattedalen (`isacsvensson.github.io`): cache-prefix
  `minnesstigen-` och databasnamnet `minnesstigen` får aldrig krocka med Mattedalens.
- Den pedagogiska motorn kompileras med enbart ES-lib (`tsconfig.engine.json`), så den kan
  inte råka bero på DOM – och kan flyttas till annan plattform utan omskrivning.

## Konsekvenser
- + Litet (≈ 50 kB JS), snabbt, inga ramverksberoenden att uppgradera. Enda
  körberoendet är `idb`.
- + Gratis drift, enkel distribution till pilotklasser via en länk.
- + Kod, mönster och lärdomar kan delas med Mattedalen.
- − Mer handskriven UI-kod än med ett ramverk; hålls hanterbar med små skärmfunktioner.
- − Talsyntes och lagring varierar mellan webbläsare → bara lokala röster används;
  inspelade röster utvärderas i M5.
