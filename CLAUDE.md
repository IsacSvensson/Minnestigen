# CLAUDE.md

Minnesstigen är en forskningsbaserad minnesapp för barn 6–12 år. Kärnan är
**hämtningsövning med återkoppling och utspridd repetition**; minnestekniker är verktyg
ovanpå. Allt underlag finns i `docs/` – läs `docs/README.md` först och
`docs/produktregler.md` innan du ändrar något barnet ser.

## Kommandon
- `npm test` – enhetstester (vitest, `tests/`)
- `npm run e2e` – webbläsartester (Playwright, `e2e/`, telefon + surfplatta)
- `npm run typecheck` – TypeScript (app, motor med enbart ES-lib, tester, e2e)
- `npm run build` – produktionsbygge till `dist/`
- `npm run dev` – utvecklingsserver

Kör `typecheck`, `test`, `build` och `e2e` innan commit.

## Plattform
Bara klient: statisk PWA i vanilla TypeScript utan ramverk, publicerad på GitHub Pages från
standardgrenen. Uppsättningen följer systerprojektet Mattedalen (IsacSvensson/Mattedalen) –
titta där först när något nytt behövs (installationsguide, bakåtknapp, överföring mellan
enheter). Samma ursprung som Mattedalen: allt som lagras eller cachas heter `minnesstigen…`.

## Struktur
- `src/engine/` – pedagogisk motor, ren TS, bara ES-lib. Tid skickas in som parameter.
  Pedagogiska parametrar är namngivna konstanter med evidensnivå (N1–N4).
- `src/app/` – `actions.ts` (rena funktioner data → data), `state.ts`, kortlekslogik
- `src/storage/` – IndexedDB (`idb`), migreringar i `MIGRATIONS`, minnesfallback
- `src/graphics/` – **all grafik, egenritad SVG-markup**. Inga ikon-/illustrationsbibliotek.
  Följ `docs/design/grafik.md`.
- `src/shell/` – webbläsardelen: `dom.ts` (`h`, `s`, `fill`, `svgMarkup`), `ui.ts`
  (knappar, `screen`, `guide`), `app.ts` (`show`), `modes/`, `screens/`, `styles.css`

## Regler som aldrig bryts
- Rätt svar visas alltid efter varje försök.
- Inga streaks, topplistor, tidspress, köp eller lootboxar. Världen låses upp av
  deltagande, aldrig av prestation.
- Huvudmåttet barnet ser är långtidsminne, inte dagens poäng.
- Ingen data lämnar enheten. Inga GMS-namn eller -material.
- Lova aldrig bättre betyg, koncentration eller intelligens.

## Språk
- UI-texter och dokumentation på svenska; kod och kodkommentarer på engelska, med svenska
  domäntermer i kommentarer där de kopplar till docs (t.ex. "Göm och säg").
- Texter till barnet: korta, enkla, uppläsbara (`Guide` har `say`-prop för uppläsning).

## Planering
- `docs/PLAN.md` – milstolpar och status. Uppdatera när något blir klart.
- `docs/ARBETSSATT.md` – definition of done.
- `docs/adr/` – arkitekturbeslut.
