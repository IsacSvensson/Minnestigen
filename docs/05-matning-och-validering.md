# 05 Mätning och validering

Utdrag ur beslutsunderlaget avsnitt E5, E6 och F.

## Spel kontra verkligt lärande (E5)

Bättre resultat i appens spel bevisar inte att barnet lärt sig teknikerna. Appen behöver
mått utanför spelets ramar:

- **Transferuppdrag:** nytt material, annat format (muntligt, papper, med förälder), utan
  appens bilder och ledtrådar.
- **Fördröjda kontroller:** samma innehåll efter en vecka och en månad, utan förvarning.
- **Spontant strategival:** når barnet efter en teknik utan att appen föreslår den?
- **Förälder- och lärarsignal:** kort fråga varannan vecka om barnet använt knepen.

## Mätindikatorer (E6)

| Indikator | Vad den mäter | Hur | När | I koden |
|---|---|---|---|---|
| Omedelbar återkallning | Kodningens styrka | Andel rätt direkt efter övning | Varje pass | `recallIn(…, 'learn')` |
| Återkallning inom passet | Minne efter kort distraktion | Andel rätt i Återvänd efter 1–3 min | Varje pass | `recallIn(…, 'return')` (M2) |
| Fördröjd återkallning | Långtidsminne | Andel rätt efter 1, 7 och 30 dagar | Enligt schema | `delayedRecall` |
| Glömskekurva per teknik | Vilken teknik håller för vilket material | Andel rätt över tid per teknik/materialtyp | Löpande | (M2) |
| Ledtrådsbehov | Hur mycket stöd barnet behöver | Steg i ledtrådsstegen före rätt svar | Varje försök | `meanHintSteps` |
| Självständigt strategival | Om barnet äger tekniken | Andel nya uppgifter där barnet väljer teknik utan uppmaning | Steg 6, transfer | (V2) |
| Strategivalets träffsäkerhet | Metakognitiv förmåga | Match uppgiftstyp – vald teknik | Steg 6 | (V2) |
| Strategikunskap | Förstår barnet vad knepet hjälper till med | Barnet väljer/formulerar när och varför knepet passar | Vid avslutat steg | (M3) |
| Överföring | Användning utanför appen | Oövat material i annat format | Var fjärde vecka | (M2) |
| Kalibrering | Metaminne | Förutsägelse jämfört med utfall | Steg 0, återkommande | `calibrationBias` |
| Upplevelse | Begriplighet och glädje | Smiley-skala + kort föräldrafråga | Varannan vecka | (M2) |

> **Poäng, snabbhet och antal dagar i rad räknas inte som lärande** och loggas inte som
> lärandemått.

## Valideringsplan (F)

Två faser. **Bara den randomiserade jämförelsen kan visa att appen orsakar bättre minne**;
före–efter-mätningar utan kontrollgrupp kan det inte.

### Fas 0 – Begriplighet och användbarhet
- 8–12 barn (hälften 6–8, hälften 9–12 år) med vårdnadshavare.
- Spelar steg 0–3 och tänker högt; testledaren noterar var instruktioner missförstås.
- Mått: klarar uppgiften utan hjälp, kan förklara tekniken med egna ord, vill fortsätta
  (smiley-skala, kort intervju).
- Beslut: justera språk, bilder och svårighetsgrad före piloten.

### Fas 1 – Klusterrandomiserad pilot
- Randomisering på **klassnivå** (barn i samma klass smittar varandra med knep).
  Förregistrera hypoteser och analys (t.ex. OSF).
- **Villkor:**
  - **A** Minnesstigen: strategiundervisning + hämtning + spridning.
  - **B** Aktiv kontroll: samma innehåll, tid och spridda hämtning, men **utan
    strategiundervisning**. A–B isolerar värdet av teknikerna och strategivalet.
  - **C** Väntelista: vanlig undervisning, får appen efteråt.
- **Dos:** 3 pass à 10 min/vecka i 5 veckor. Inom A slumpas Fokuseringsrummet på/av per barn.
- **Storlek:** ≈ 64 barn/grupp för d = 0,5 med 80 % styrka (mer med klusterdesign). En
  första pilot med 3–6 klasser är en **genomförbarhetsstudie**.
- **Mättillfällen:** före, direkt efter, efter 1 vecka, efter 6–8 veckor.
- **Blindning:** testledare vet inte villkor. **Alla effektmått utanför appen**, på papper
  eller muntligt.

### Vad som mäts

| Fråga | Mått | Format |
|---|---|---|
| Lär sig barnet tekniken? | Beskriver och demonstrerar på nytt exempel, kodat av två bedömare | Individuellt samtal |
| Minns barnet det övade bättre? | Andel rätt direkt och fördröjt | Papper/muntligt |
| Fungerar tekniken på nytt material? | Nära och fjärran överföring | Papper/muntligt |
| Väljer barnet själv? | Scenariofrågor och tänka högt, kodat | Intervju |
| Bidrar Fokuseringsrummet? | Fördröjd återkallning och skattat lugn, med/utan, inom A | Jämförelse inom A |
| Är metoden begriplig och rolig? | Smiley-skala, intervjuer, förälder- och lärarfrågor | Enkät/intervju |

### Analys
- Blandade modeller (barn inom klasser), intention-to-treat.
- Huvudjämförelse **A mot B** på fördröjd återkallning och överföring; A mot C sekundärt.
- Utnyttjandeunderskott (fler strategier men inte bättre minne) **redovisas som resultat**.
- Inga orsakspåståenden om betyg, koncentration eller intelligens.
- Appens loggdata (E6) är sekundära mått. Rapportera alla utfall.

## Konsekvenser för koden

- Appen måste kunna köras i **villkor B** (samma innehåll och schema, utan
  strategiundervisning) och slumpa **Fokuseringsrummet** per barn → planerat som
  konfigurationsflaggor i M5.
- Loggdata ska kunna exporteras pseudonymiserat för forskningshuvudmannen (M5).
