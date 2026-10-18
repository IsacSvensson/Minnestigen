# Plan framåt

Målet för version 1 är enligt underlaget (G1): **tillräckligt för att pröva kärnan i en
pilot** – hämtnings- och repetitionsmotorn, steg 0–4, skolkopplingen och mätningen. Allt
annat väntar tills piloten visat att grunden fungerar.

Vi bygger i milstolpar där **varje milstolpe ger en spelbar app** som kan visas för barn.
Ordningen följer underlagets prioritetslista (G1) men med den spelbara kärnan först, så att
vi kan börja testa med riktiga barn tidigt.

## Översikt

| Milstolpe | Innehåll | Prio i G1 | Status |
|---|---|---|---|
| **M1 Kärnslinga** | Motor, mätning (grund), steg 0–1, skolkoppling, vuxenläge, egen grafik | 1, 2, 3, 6, 7, 8 (delvis) | ✅ Klar |
| **M2 Hela passet** | Återvänd, förstå-kontroll, Fokuseringsrummet, Sorteringslabbet (steg 2), transferuppdrag, offline | 2, 3, 7, 9, 10 | Nästa |
| **M3 Bilder och berättelser** | Bildmaskinen, Berättelsetåget, stödtoning visa → tillsammans → själv | 4 | |
| **M4 Mitt minnespalats** | Loci med 5–10 platser, foto/ritning lokalt | 5 | |
| **M5 Pilotberedskap** | Villkor B, slumpning, export, DPIA, röster, tillgänglighetsgranskning | 8, 9, 11 | |
| **Fas 0** | Användbarhetsstudie med 8–12 barn, justering | – | |
| **Fas 1** | Klusterrandomiserad pilot | – | |
| **Version 2** | Ordverkstaden, Verktygslådan, lärarläge, interfoliering, adaptivt schema, Kodknäckaren, fler områden | G2 | Efter pilot |

## M1 Kärnslinga ✅

- [x] Dokumentation utdragen ur underlagen ([docs/](README.md)), produktregler, plan, arbetssätt
- [x] Projekt: React + TypeScript + Vite, PWA-manifest, CI (typkontroll, test, bygge)
- [x] **Pedagogisk motor** ([`src/engine/`](../src/engine)): repetitionsschema per teknik,
      ledtrådsstege, passplanering, progression (alla 8 steg som data), mätindikatorer
      (omedelbar/fördröjd återkallning, kalibrering, ledtrådsbehov, långtidsrubrik)
- [x] Enhetstester för motorn
- [x] **Egen grafik**: Ugglan (4 lägen), 16 föremålsbilder, ikonset, Mönsterskogen med lyktor
- [x] Designsystem (färgtokens, knappar, kort, pratbubbla med uppläsning)
- [x] **Steg 0 – Gissa och pröva** inkl. nästa-dag-kontroll och kalibrering
- [x] **Steg 1 – Göm och säg**: titta → göm → säg/välj → kolla, ledtrådsstege
- [x] Passflöde: uppvärmning → dagens verktyg → reflektion → vardagsuppdrag
- [x] Steg 0 → 1 enligt kriteriet (två rundor + barnet säger att knep hjälper)
- [x] Skolkopplingen (grund): förälder lägger in listor `fråga = svar`
- [x] Vuxenläge bakom spärr: profil, lärandeprofil, radera data
- [x] Samtycke vid första start; all data lokalt

## M2 Hela passet

- [ ] **Återvänd** inom passet: efter reflektionen, försök minnas dagens nya kort igen (kontext `return`)
- [ ] **Förstå-kontroll "Förklara för ugglan"**: välj bland formuleringar (yngre), tal (senare)
- [ ] **Fokuseringsrummet**: Landa, Lyssna, Samla tankarna – 30–120 s, alltid överhoppningsbart; egen animerad grafik
- [ ] **Sorteringslabbet (steg 2)**: dra bilder till högar, dela nummer i bitar; mät minne, inte bara sortering; utnyttjandeunderskott → fler exempel
- [ ] Kriterier steg 1 → 2 (självtest utan uppmaning, fördröjd återkallning ökar)
- [ ] **Transferuppdrag** var fjärde vecka (förälder förhör utan appens bilder, registrerar i vuxenläget)
- [ ] **Upplevelse**: smiley-skala varannan vecka + kort föräldrafråga
- [ ] Glömskekurva per teknik och materialtyp i lärandeprofilen
- [ ] **Offline**: service worker, installérbar PWA
- [ ] Flytta lagring till IndexedDB med schemamigrering (förberedelse för bilder i M4)
- [ ] Komponent-/e2e-tester (Playwright) för passflödet
- [ ] Skrivläge i Göm och säg för äldre barn

## M3 Bilder och berättelser (steg 3)

- [ ] **Illustrationsarbete**: färdiga absurda bilder med *levande, handlande* figurer
      (kroppslistan: huvud, näsa, mun, mage, fötter) – största grafikinsatsen hittills
- [ ] **Bildmaskinen**: kombinera två saker till en tokig bild; färdig → välj bland tre → egen (rita/spela in)
- [ ] **Berättelsetåget**: vagnar kopplas ihop, bruten länk syns som lucka, förslag på starkare bild
- [ ] Stödtoning **visa → gör tillsammans → gör själv** styrd av fördröjt resultat (motorn)
- [ ] Tätare schema för bildminnen används på riktigt (finns i motorn)
- [ ] Strategikunskap-mätning vid avslutat steg
- [ ] Ritverktyg för egna bilder (lokalt)

## M4 Mitt minnespalats (steg 4)

- [ ] Rutt med 5, sedan 10 platser: foto eller ritning av hemmet, **sparas bara lokalt**
- [ ] Placera figurer (samlarfigurer, egen grafik), vandra tillbaka
- [ ] Återkoppling: rutten med rätt och saknade platser
- [ ] Återanvänd rutt med ny lista efter två veckor
- [ ] Platsen som ledtråd i ledtrådsstegen (finns i motorn)

## M5 Pilotberedskap

- [ ] **Villkor B** (aktiv kontroll): samma innehåll, tid och schema utan strategiundervisning – konfigurationsflagga
- [ ] **Slumpning** av Fokuseringsrummet per barn inom villkor A
- [ ] Pseudonymiserad **export** av loggdata till forskningshuvudmannen
- [ ] **DPIA**, juridisk avstämning, samarbete med lärosäte, etikansökan
- [ ] **Inspelade röstrepliker** på svenska i stället för talsyntes
- [ ] Tillgänglighetsgranskning (dyslexi, ADHD, svag inre bildförmåga)
- [ ] Ett komplett område (Mönsterskogen) med en berättelse genom passen

## Arbetsrytm

1. Varje milstolpe bryts ned i GitHub-issues (en per rad ovan), märkta
   `pedagogik`, `grafik`, `teknik` eller `forskning`.
2. Varje issue blir en eller flera små PR:er (se [Arbetssätt](ARBETSSATT.md)).
3. **Milstolpsavslut:** demo i telefon och surfplatta, genomgång mot
   [produktreglerna](produktregler.md), uppdatera denna plan och statuskolumnerna i
   [04 Appkoncept](04-appkoncept.md).
4. Så tidigt som M2: **informella tester med 2–3 barn** i bekantskapskretsen för språk och
   begriplighet – inför den formella Fas 0.
