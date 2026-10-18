# ADR 0004 – All data lokalt på enheten i version 1

**Status:** Beslutad (2026-10-18)

## Sammanhang
Målgruppen är under 13 år. Underlaget kräver vårdnadshavares samtycke, att hemmabilder
bara lagras på enheten, inga sociala funktioner, ingen profilering och DPIA före lansering.

## Beslut
- Version 1 har **ingen server**. All data ligger i webbläsarens lagring på enheten, i ett
  versionerat schema (`src/storage/store.ts`). `localStorage` nu, IndexedDB från M2
  (krävs för bilder i M4).
- Vårdnadshavare bekräftar samtycke vid första start; vuxenläget kan radera allt.
- Export för piloten (M5) sker pseudonymiserat och på vårdnadshavares/forskningshuvudmannens
  initiativ.

## Konsekvenser
- + Starkt integritetslöfte, inga personuppgiftsbiträden, ingen drift.
- − Ingen synk mellan skola och hem. Lärarläge (version 2) kräver backend, avtal med
  huvudmän och nytt ADR.
- − Data kan försvinna om webbläsaren rensar lagring → informera föräldrar; utvärdera
  `navigator.storage.persist()` i M2.
