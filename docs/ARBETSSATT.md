# Arbetssätt

## Flöde

1. **Issue först.** Varje förändring utgår från en rad i [PLAN](PLAN.md) eller ett issue.
   Pedagogiska förändringar hänvisar till avsnitt i `docs/` och anger evidensnivå (N1–N4).
2. **En branch per ändring**, små PR:er mot `main`. Hellre tre små än en stor.
3. **CI måste vara grön**: typkontroll, enhetstester, bygge (`.github/workflows/ci.yml`).
4. **Granskning mot [produktreglerna](produktregler.md)** – checklistan används i varje PR
   som rör det barnet ser eller hur motorn beslutar.
5. Merga, uppdatera status i PLAN.

## Definition of done

- [ ] `npm run typecheck`, `npm test` och `npm run build` går igenom
- [ ] Ändringar i `src/engine/` har enhetstester
- [ ] UI provat i mobilbredd (390 px) och surfplatta (768 px), med skärmdump i PR:en
- [ ] Ny grafik följer [designguiden](design/grafik.md) och är egenritad
- [ ] Texter till barnet är korta, på enkel svenska och går att läsa upp
- [ ] Docs uppdaterade om beteende, schema eller kriterier ändrats
- [ ] Inga brott mot produktreglerna

## Arkitekturregler

```
src/
  engine/    Pedagogisk motor – ren TypeScript, inga React- eller lagringsberoenden
  storage/   Lokal lagring (versionerat schema)
  app/       App-state och kopplingen motor ↔ lagring ↔ UI
  content/   Inbyggt innehåll (kortlekar)
  graphics/  All egen grafik som SVG-komponenter
  ui/        Designsystem: tokens, knappar, kort, Ugglan med pratbubbla
  features/  Skärmar: home, session, modes (spellägen), parent (vuxenläge)
```

- **Motorn bestämmer, UI:t visar.** Schema, ledtrådar, progression och mått ligger i
  `engine/`. En skärm får aldrig själv avgöra när något ska repeteras.
- **Pedagogiska parametrar** (intervall, trösklar, antal kort) är namngivna konstanter med
  kommentar om källa och evidensnivå. N4-värden ska vara lätta att kalibrera efter piloten.
- **Tid** skickas in som parameter i motorn (`today`) – aldrig `new Date()` inne i
  motorfunktioner – så att allt går att testa.
- **Ingen data lämnar enheten** utan ett nytt ADR-beslut, DPIA och vårdnadshavares val.
- **Beroenden:** så få som möjligt. Inga UI-kit, ikon- eller illustrationsbibliotek.

## Beslut

Större beslut dokumenteras som ADR i [`docs/adr/`](adr/): sammanhang, beslut, konsekvenser.
Ett beslut ändras genom ett nytt ADR som ersätter det gamla.

## Kommandon

```bash
npm install         # installera
npm run dev         # utvecklingsserver
npm test            # enhetstester
npm run typecheck   # typkontroll
npm run build       # produktionsbygge till dist/
```

## Att jobba med Claude

`CLAUDE.md` i repots rot sammanfattar regler och struktur för AI-assisterad utveckling.
Håll den uppdaterad när arbetssättet ändras.
