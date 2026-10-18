# 08 Öppna frågor

## Kräver forskning (underlaget G4)

- [ ] Lär sig typiskt utvecklade 8–10-åringar minnespalats i appform, och håller effekten
      efter en månad?
- [ ] Hur snabbt kan färdiga bilder tonas ut innan nyckelordsminnen blir för bräckliga?
- [ ] Ger strategiundervisning mer spontan strategianvändning utanför appen än enbart
      spridd hämtning? *(A mot B i piloten)*
- [ ] Vilket repetitionsschema passar barn bäst, och skiljer det mellan bildbaserat och
      annat material?
- [ ] Har yngre barn mer nytta av berättelser och äldre av platser?
- [ ] Hur fungerar modellen för barn med ADHD, dyslexi eller svag inre bildförmåga?
- [ ] Påverkar föräldrars och lärares minnesprat effekten, och kan appen lära ut det?
- [ ] Ger Fokuseringsrummet bättre minnesinlärning, eller bara en lugnare start?
- [ ] Ökar när–då-planer att barnet använder knepen i vardagen?
- [ ] Vilken svensk sifferkod är lättast för barn, och behövs den alls?

## Produkt- och teknikfrågor (våra egna)

- [ ] **Plattform:** räcker PWA på GitHub Pages för piloten (surfplatta i skolan + föräldrars
      telefoner), eller behövs butiksappar? Se [ADR 0001](adr/0001-plattform-pwa.md).
- [ ] **Flytta mellan enheter** (skola ↔ hem) utan server – Mattedalen gör det med QR-kod och
      fil. Riktig synk kräver backend, DPIA och avtal; inte i version 1.
- [ ] **Uppläsning:** webbläsarens talsyntes varierar kraftigt i kvalitet. Inspelade
      röstrepliker (svenska) före Fas 0? Glosor läses nu på rätt språk, men saknar enheten
      t.ex. en engelsk röst läses de inte alls – ska appen tala om det för den vuxne?
- [x] ~~Vuxenspärren~~ – fyrsiffrig vuxenkod, som i Mattedalen.
- [ ] **Flera barn på samma enhet** (syskon) – Mattedalen har profiler. Behövs det här?
- [ ] **Licens** – Mattedalen är PolyForm Noncommercial. Samma här?
- [ ] **Startsteg efter ålder:** alla börjar på steg 0 idag. Behövs ett placeringstest för
      äldre barn redan i version 1?
- [ ] **Kriterier för steg 1 → 2** ("startar självtest utan uppmaning") – hur mäter vi
      "utan uppmaning" i appen?
- [ ] **Ugglans namn och röst** – heter den bara Ugglan?
- [ ] **Fördröjd återkallning för bildset:** tröskeln 80 % för "kom ihåg setet" är N4.
