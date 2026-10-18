# CLAUDE.md

Minnesstigen är en forskningsbaserad minnesapp för barn 6–12 år. Kärnan är
**hämtningsövning med återkoppling och utspridd repetition**; minnestekniker är verktyg
ovanpå. Allt underlag finns i `docs/` – läs `docs/README.md` först och
`docs/produktregler.md` innan du ändrar något barnet ser.

## Kommandon
- `npm test` – enhetstester (vitest)
- `npm run typecheck` – TypeScript
- `npm run build` – produktionsbygge
- `npm run dev` – utvecklingsserver

Kör alla tre (`test`, `typecheck`, `build`) innan commit.

## Struktur
- `src/engine/` – pedagogisk motor, ren TS, inga React-/lagringsimporter. Tid skickas in
  som parameter. Pedagogiska parametrar är namngivna konstanter med evidensnivå (N1–N4).
- `src/storage/` – lokal lagring, versionerat schema
- `src/app/` – app-state (`AppState.tsx`) och kortlekslogik
- `src/graphics/` – **all grafik, egenritad SVG**. Inga ikon-/illustrationsbibliotek.
  Följ `docs/design/grafik.md`.
- `src/ui/` – designsystem (tokens i `theme.css`, komponenter)
- `src/features/` – skärmar och spellägen

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
