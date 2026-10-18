# ADR 0004 – All data lokalt på enheten, i IndexedDB

**Status:** Beslutad (2026-10-18)

## Sammanhang
Målgruppen är under 13 år. Underlaget kräver vårdnadshavares samtycke, att hemmabilder
bara lagras på enheten, inga sociala funktioner, ingen profilering och DPIA före lansering.

## Beslut
- Ingen server. All data ligger i **IndexedDB** på enheten (`src/storage/`), som i
  Mattedalen: versionerade migreringar (`MIGRATIONS` i `idb.ts`), ett dokument (`AppData`)
  med `normalize()` för fält som tillkommit. Blockerar webbläsaren IndexedDB används ett
  minneslager och barnet får veta att inget sparas.
- Appen ber webbläsaren om beständig lagring (`navigator.storage.persist()`); vuxenläget
  visar status.
- Vårdnadshavare bekräftar samtycke vid första start; vuxenläget (bakom fyrsiffrig kod)
  kan radera allt.
- Export för piloten (M5) sker pseudonymiserat och på vårdnadshavares/forskningshuvudmannens
  initiativ.

## Konsekvenser
- + Starkt integritetslöfte, inga personuppgiftsbiträden, ingen drift.
- + IndexedDB rymmer bilder till minnespalatset (M4).
- − Ingen synk mellan skola och hem. Lärarläge (version 2) kräver backend, avtal med
  huvudmän och nytt ADR. Överföring mellan enheter kan lösas utan server (Mattedalen
  använder QR-kod/fil) – se PLAN.
- − Allt i ett dokument räcker länge men loggen växer; komprimering av gamla försök
  (som Mattedalens `compactLog`) när det behövs.
