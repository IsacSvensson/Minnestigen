# ADR 0002 – All grafik egenritad, som SVG i kod

**Status:** Beslutad (2026-10-18)

## Sammanhang
Grafiken ska vara helt egen. Underlaget varnar för upphovsrättsskyddat material
(GMS-illustrationer och kodtabeller) och kräver att AI-genererade bilder granskas.
Pedagogiken ställer specifika krav: tydliga föremål för igenkänningstest, levande och
handlande figurer, absurda minnesbilder, lyktor som tänds.

## Beslut
- All grafik ritas för projektet som **handskriven SVG** i `src/graphics/*.ts`: varje
  ritning är markup i källkoden som blir ett `<svg>` via `svgMarkup()`. Markupen är alltid
  konstant källkod, aldrig text från användaren.
- Inga ikon- eller illustrationsbibliotek, UI-kit eller stockbilder.
- Gemensamt bildspråk enligt [designguiden](../design/grafik.md).
- Enda undantaget: typsnittet Nunito (OFL), självhostat.

## Konsekvenser
- + Skarpt på alla skärmar, små filer, lätt att animera, färgsätta och kombinera
  (t.ex. två föremål till en tokig bild i Bildmaskinen).
- + Inga licensfrågor.
- − Illustrationsarbetet är vår största återkommande kostnad, särskilt i M3. Komplexa
  scener kan ritas i ett vektorprogram och klistras in som markup i samma stil.
