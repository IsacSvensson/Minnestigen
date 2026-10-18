# ADR 0002 – All grafik egenritad, som SVG-komponenter

**Status:** Beslutad (2026-10-18)

## Sammanhang
Grafiken ska vara helt egen. Underlaget varnar för upphovsrättsskyddat material
(GMS-illustrationer och kodtabeller) och kräver att AI-genererade bilder granskas.
Pedagogiken ställer specifika krav: tydliga föremål för igenkänningstest, levande och
handlande figurer, absurda minnesbilder, lyktor som tänds.

## Beslut
- All grafik ritas för projektet som **handskriven SVG i React-komponenter** i
  `src/graphics/`. Inga ikon- eller illustrationsbibliotek, UI-kit eller stockbilder.
- Gemensamt bildspråk enligt [designguiden](../design/grafik.md).
- Enda undantaget: typsnittet Nunito (OFL) tills vidare.

## Konsekvenser
- + Skarpt på alla skärmar, små filer, lätt att animera, färgsätta och kombinera
  (t.ex. två föremål till en tokig bild i Bildmaskinen).
- + Inga licensfrågor.
- − Illustrationsarbetet är vår största återkommande kostnad, särskilt i M3. Komplexa
  scener kan ritas i ett vektorprogram och exporteras till SVG-komponenter enligt samma stil.
