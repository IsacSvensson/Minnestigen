# 03 Metod: Minnesstigen

Utdrag ur beslutsunderlaget avsnitt D och metoddokumentet. Minnesstigen är en egen
syntes (**N4**): varje steg vilar på forskningen i [01](01-forskningsgrund.md), men
helheten är ett produktförslag som prövas i piloten.

## Sex principer

1. **Förstå först.** Barnet förklarar innehållet med egna ord innan något memoreras.
   Minnestekniker bara för det som är godtyckligt.
2. **Gör det minnesbart.** Godtyckligt stoff blir grupper, bilder, berättelser, platser
   eller ord.
3. **Plocka fram utan att titta.** All inlärning avslutas och återkommer som hämtning,
   **alltid följd av rätt svar**.
4. **Sprid ut.** Appen schemalägger repetition över dagar och veckor; bildbaserade minnen
   repeteras tätare.
5. **Välj verktyg.** Barnet tränar att matcha uppgift och teknik och att motivera valet.
6. **Ta med ut.** Varje teknik prövas på riktigt skolstoff och i vardagen, utanför spelet.

## Arbetsgången

```
                 5 Välj verktyg
                 (vilket knep passar?)
                        │
                        ▼            ┌── nästa dag, nästa vecka ──┐
1 Förstå  ──▶  2 Gör minnesbart ──▶  3 PLOCKA FRAM  ──▶  4 Sprid ut
(egna ord)     (grupp, bild, plats)  (göm, säg, kolla)   (repetera över dagar)
                                                               │
                                                               ▼
                                                         6 Ta med ut
                                                         (skola och vardag)
```

**Plocka fram är navet:** allt som kodats återkommer som hämtning med jämna mellanrum,
medan strategival styr vilken kodning som används.

**Stödet tonas ut:** varje teknik går från **visa** (appen gör, barnet tittar) via **gör
tillsammans** (barnet väljer bland färdiga alternativ) till **gör själv** (egen ledtråd).
Steget styrs av **fördröjt resultat, inte av ålder eller antal pass**.

**Två stödmoment runt kärnan (N2/N4):** det valfria Fokuseringsrummet före passet och en
när–då-plan efteråt, där barnet bestämmer när kunskapen ska användas. Landningen är till
för att komma till ro, inte för att stärka minnet.

## Progression i åtta steg

Åldrar är startpunkter. Alla kriterier för att gå vidare är förslag (N4) som kalibreras
i piloten. Datan finns i koden i [`src/engine/progression.ts`](../src/engine/progression.ts).

### Steg 0 – Minnesupptäckaren (från 6 år)
- **Mål:** upptäcka att minnas är något man gör, och att man kan bedöma sitt eget minne.
- **Stöd:** metaminne förutsäger senare strategianvändning; vuxnas minnesprat ökar den (N2).
- **Teknik:** förutsäga–pröva–jämföra.
- **Övning:** sex bilder, gissa hur många man minns, testas, jämför med gissningen.
- **Återkoppling:** stapel för gissning och utfall + "Gjorde du något för att komma ihåg?"
- **Fördröjt test:** samma bilder nästa dag.
- **Överföring:** gissa och pröva med en verklig sak (frukostbordet).
- **Gå vidare:** två genomförda rundor och barnet kan säga att det går att göra något för
  att minnas bättre.

### Steg 1 – Plocka fram (från 6 år)
- **Mål:** självtest blir barnets första och viktigaste verktyg.
- **Stöd:** hämtningsövning med återkoppling, även i lågstadiet (N1).
- **Teknik:** titta – göm – säg – kolla.
- **Övning:** fem av veckans ord eller tabellfakta; dölj svaret, säg eller välj, kolla.
- **Återkoppling:** rätt svar direkt efter varje försök; beröm försöket, inte snabbheten.
- **Fördröjt test:** dag 1, 3 och 7.
- **Överföring:** förhör sig själv på en lista som förälder/lärare lagt in, utan appens bilder.
- **Gå vidare:** startar självtest utan uppmaning i tre pass, och fördröjd återkallning
  efter en vecka är högre än vid första testet.

### Steg 2 – Sortera och gruppera (från 6 år)
- **Mål:** ordna material i grupper och bitar innan man memorerar.
- **Stöd:** organisering och chunkning (N1); risk för utnyttjandeunderskott (N1).
- **Övning:** tolv bilder sorteras i högar; ett telefonnummer delas i bitar.
- **Återkoppling:** visa hur grupperna syns i det barnet minns ("Du mindes alla frukter
  tillsammans").
- **Fördröjt test:** efter en dag och en vecka, utan sorteringsstöd.
- **Överföring:** gruppera en riktig inköps- eller packlista.
- **Gå vidare:** grupperar spontant på ny lista och minns mer än utan gruppering.
  **Om sortering ökar men minnet inte gör det:** stanna, fler exempel, förklara varför.

### Steg 3 – Bilder och berättelser (från 6–7 år)
- **Mål:** göra saker till levande, roliga bilder och knyta ihop dem.
- **Stöd:** interaktiva bilder fungerar för barn när de ges färdiga; berättelser kan passa
  yngre bättre (N2).
- **Tekniker:** visualisering, överdrift, länkberättelse, kroppslista.
- **Övning:** fem saker kopplas till huvud, näsa, mun, mage, fötter – först appens färdiga
  absurda bilder med levande figurer, sedan välj bland tre, sedan egen ritad/berättad bild.
- **Återkoppling:** återge i ordning; visa vilken länk som brast och föreslå en starkare bild.
- **Fördröjt test:** dag 1, 3 och 7; bildminnen får en extra repetition.
- **Överföring:** morgonrutin eller gympapåse som berättelse; förälder bekräftar.
- **Gå vidare:** egna bilder i minst hälften av försöken och fördröjt resultat i nivå med
  färdiga bilder.

### Steg 4 – Mitt minnespalats (från 8–9 år)
- **Mål:** en fast rutt hemma för ordnade listor.
- **Stöd:** loci, starkt hos vuxna (N1), lovande och genomförbart i app för barn (N2).
- **Teknik:** loci med 5, sedan 10 platser.
- **Övning:** fem platser i rummet (foto eller ritning, **sparas lokalt**), placera fem
  saker som levande figurer i rörelse, vandra tillbaka.
- **Återkoppling:** rutten visas med rätt och saknade platser markerade.
- **Fördröjt test:** efter en dag och en vecka; samma rutt med ny lista efter två veckor.
- **Överföring:** planeterna, en historisk händelsekedja, en muntlig presentation.
- **Gå vidare:** minst 8 av 10 rätt i ordning efter en dag på två olika listor.

### Steg 5 – Ordverkstaden: nyckelord och knaggar (från 8–10 år) – *version 2*
- **Mål:** glosor, namn och numrerade listor med ljudlika nyckelord och fasta knaggar.
- **Stöd:** stora omedelbara vinster, snabb glömska utan repetition, färdiga bilder skyddar (N1/N2).
- **Tekniker:** nyckelord (meningsvariant först), rimknaggar 1–10.
- **Övning:** sex engelska glosor med färdiga nyckelordsbilder; barnet bygger meningen.
- **Fördröjt test:** tätare: dag 1, 2, 4, 7 och 14.
- **Överföring:** veckans glosor utan nyckelordsbilder.
- **Gå vidare:** fördröjt resultat efter två veckor minst lika bra som med bara självtest.
  Om inte: nyckelord passar inte materialet, och barnet får veta det.

### Steg 6 – Välj verktyg (från 9 år) – *full form i version 2*
- **Mål:** välja rätt teknik själv och förklara varför.
- **Stöd:** självreglerat lärande (N1/N2); utnyttjandeunderskott vid överföring (N1).
- **Förkunskaper:** minst tre verktyg från steg 1–5.
- **Övning:** blandade uppdrag (lista, nummer, glosor, förklaring) – välj, motivera,
  genomför, utvärdera, avsluta med när–då-plan.
- **Återkoppling:** både resultat och val: "Ditt val fungerade" / "Prova minnespalatset här
  nästa gång – listan hade en ordning".
- **Fördröjt test:** blandat test efter en vecka. **Överföring:** helt nytt materialslag.
- **Gå vidare:** passande val utan uppmaning i minst två av tre nya uppgifter.

### Steg 7 – Kodknäckaren (frivilligt, från 10–12 år) – *version 2*
- **Mål:** omvandla siffror till ord med en fast sifferkod.
- **Stöd:** praktikererfarenhet (N3); ingen barnforskning.
- **Teknik:** **egen** svensk variant av Major-systemet, 0–9 först. Säker ljud–bokstav-koppling krävs.
- **Övning:** årtal och portkoder som "hemliga koder". Talstöd för barn med läs-/skrivsvårigheter.
- **Gå vidare:** inget bygger på detta; fördjupningsspår.

## Repetitionsschema i koden

Implementerat i [`src/engine/scheduler.ts`](../src/engine/scheduler.ts). Dagar räknas från
inlärningsdagen. Allt utom "jämna/lätt växande" och "tätare för bilder" är N4.

| Teknik | Fördröjda kontroller (dag) |
|---|---|
| Plocka fram (hämtning) | 1, 3, 7, 14, 30 |
| Gissa och pröva (metaminne) | 1, 7, 30 |
| Sortera och gruppera | 1, 7, 14, 30 |
| Bilder och berättelser | 1, 2, 3, 7, 14, 30 (en extra tidig repetition) |
| Minnespalats | 1, 7, 14, 30 |
| Nyckelord och knaggar | 1, 2, 4, 7, 14, 30 |

Därefter var 30:e dag. **Mindes utan hjälp** → nästa intervall. **Mindes med ledtråd** →
samma intervall igen. **Glömde** (eller tryckte fram svaret) → tillbaka till dag 1. Rätt svar
visas alltid.
