# ADR 0003 – Regelstyrd pedagogisk motor, separat från UI

**Status:** Beslutad (2026-10-18)

## Sammanhang
Underlaget (E9) kräver att en regelstyrd motor bestämmer vad som tränas, när det
repeteras och när stöd tonas ut. AI får bara stå för variation inom ramarna. Det gör appen
förutsägbar och utvärderingsbar – och piloten kräver ett villkor B med samma schema men
utan strategiundervisning.

## Beslut
- `src/engine/` innehåller schema, ledtrådsstege, passplanering, progression och mått som
  **rena funktioner** över data. Tid skickas in som parameter.
- Alla pedagogiska parametrar är namngivna konstanter med evidensnivå i kommentaren.
- UI och lagring anropar motorn; motorn känner inte till dem.
- Inget AI-lager i version 1. När det kommer: förgenererat och granskat innehåll, ingen fri
  chatt, och det får aldrig ändra motorns beslut.

## Konsekvenser
- + Motorn är enhetstestad och kan kalibreras efter piloten utan UI-ändringar.
- + Villkor A/B och slumpning blir konfiguration, inte separata appar.
