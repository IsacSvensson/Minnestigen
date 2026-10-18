# 04 Appkoncept

Utdrag ur beslutsunderlaget avsnitt E. Allt här är produktförslag (**N4**) härledda från
metoden i [03](03-metod-minnesstigen.md). Korta pass på 5–10 minuter i en spelvärld som
motiverar, medan en **regelstyrd pedagogisk motor** bestämmer vad som tränas.

## Ett pass (E1)

| # | Del | Tid | Innehåll |
|---|---|---|---|
| 0 | **Fokuseringsrummet** (valfritt) | 30–120 s | *Landa* (följ andetagen), *Lyssna* (återvänd till ett valt ljud) eller *Samla tankarna* (vad går uppgiften ut på?). Aldrig krav eller belöning, kan alltid hoppas över. Lovar inte bättre minne. *Samla tankarna* är i praktiken metakognitiv planering och har troligen starkast stöd |
| 1 | **Uppvärmning** | 1–3 min | Det schemat säger är på tur, som hämtning med rätt svar efteråt |
| 2 | **Dagens verktyg** | 2–4 min | Lektion/övning i barnets steg, i läget visa, gör tillsammans eller gör själv |
| 3 | **Förstå-kontroll** | 30 s | "Förklara för ugglan" – egna ord, tal eller val bland formuleringar, innan nytt stoff kodas |
| 4 | **Återvänd** | – | Efter 1–3 minuter med något annat försöker barnet minnas det nya igen utan att titta |
| 5 | **Reflektion** | 30 s | Om strategin, inte poängen: "Vilket knep använde du? Hjälpte det?" |
| 6 | **Vardagsuppdrag med när–då-plan** | – | T.ex. gympapåsen med kroppslistan – "När jag ställer skorna i hallen tänker jag på påsen." |

Implementerat i [`src/engine/session.ts`](../src/engine/session.ts): uppvärmning (om något
är på tur), dagens verktyg, reflektion, vardagsuppdrag. Fokuseringsrummet, förstå-kontroll
och Återvänd kommer enligt [PLAN](PLAN.md).

## Spellägen (E2)

| Läge | Steg | Teknik | Mekanik | Data som samlas | Status |
|---|---|---|---|---|---|
| Gissa och pröva | 0 | Metaminne | Förutsäg antal, testa, jämför | Kalibrering | ✅ M1 |
| Göm och säg | 1 | Hämtning | Kort med dolt svar; säg, välj eller skriv; rätt svar visas | Rätt/fel, fördröjd återkallning | ✅ M1 (säg, välj) |
| Sorteringslabbet | 2 | Kategorisering, chunkning | Dra bilder till högar; dela nummer i bitar | Grupperingsgrad, återkallning | M2 |
| Bildmaskinen | 3 | Visualisering | Kombinera två saker till en tokig bild med levande figurer; först färdiga, sedan egna | Andel egna bilder, minne per bildtyp | M3 |
| Berättelsetåget | 3 | Länkberättelse, kroppslista | Vagnar kopplas ihop; bruten länk syns som lucka | Var kedjan brister | M3 |
| Mitt minnespalats | 4 | Loci | Foto/ritning av hemmet (lokalt); placera figurer; vandra tillbaka | Ordningsfel, återanvändning av rutt | M4 |
| Ordverkstaden | 5 | Nyckelord, knaggar | Färdig nyckelordsbild; barnet bygger meningen; samlarkort för knaggar | Glömskekurva per ord och metod | V2 |
| Verktygslådan | 6 | Strategival | Blandade uppdrag; välj, motivera, utvärdera | Valets träffsäkerhet, självständighet | V2 |
| Kodknäckaren | 7 | Sifferkod | Agenttema; årtal och koder | Kodningsfel | V2 |
| Skolkopplingen | Alla | Allt | Förälder/lärare lägger in glosor, tabeller, begrepp | Prestation på riktigt skolstoff | ✅ M1 (grund) |
| Fokuseringsrummet | Alla | Stöd, inte minnesteknik | Landa, Lyssna eller Samla tankarna | Om den används; resultat med/utan | M2 |

## Anpassning (E3)

- **Startnivå:** ålder sätter startsteg; ett kort inledande test justerar.
- **Stöd tonas ut** (visa → tillsammans → själv) efter **fördröjt resultat**, inte antal pass.
- **Ledtrådsstege** i varje uppgift: första bokstaven → platsen → bilden → svaret. Barnet
  ska lyckas med så lite hjälp som möjligt.
- **Schema:** jämna eller lätt växande intervall; tätare för bildbaserat.
- **Felmönster:** använder barnet en teknik utan att minnas mer (utnyttjandeunderskott) →
  fler exempel och en förklaring, **inte** nästa nivå.
- **Tillgänglighet:** uppläsning, svar med tal eller bild, korta pass, paus. Sifferkoden
  har talstöd.

## Belöningar som gynnar lärande (E4)

- **Belöna:** försöket att plocka fram innan man tittar, motiverade strategival, ärliga
  gissningar i Gissa och pröva, genomförda vardagsuppdrag.
- **Huvudmåttet barnet ser är långtidsminne:** *"Du kom ihåg 8 av 10 från förra veckan"* –
  inte dagens poäng.
- **Samling, inte tvång:** knaggfigurer och möbler till minnespalatset. Välkommen tillbaka
  efter paus.
- **Aldrig:** streaks/streak-skam, tidspress, topplistor mot andra barn, köp i appen,
  lootboxar.

## Spelvärld och två framstegssystem (E8)

Arbetsnamn **Minnesväktarna**: kunskap håller på att försvinna i en värld som barnet
återställer genom att lära sig knep och använda dem. Spelvärlden är ett motivationslager
ovanpå modellen, inte modellen själv.

| Område | Motsvarar | Vad barnet gör |
|---|---|---|
| **Mönsterskogen** | Steg 2 och förstå-kontrollen | Grupperar, hittar samband, skiljer på att förstå och att kunna återge |
| Minnesbiblioteket | Steg 3–5 | Bilder, berättelser, minnespalats, nyckelord |
| Vardagsbyn | Steg 6 och vardagsuppdragen | Instruktioner, planering, nytt material |

- **Världens framsteg** låses upp genom **deltagande och utforskande**. Barnet fastnar
  aldrig för att det minns dåligt. *I appen: varje genomfört pass tänder en lykta längs
  stigen i Mönsterskogen.*
- **Lärandeprofilen** bygger på fördröjd återkallning, ledtrådsbehov, strategival,
  överföring och strategikunskap. Den **styr motorn men låser inte upp världen** – annars
  lär sig barnet jaga poäng.
- Börja med **ett område och en berättelse**; resten efter piloten.

## Pedagogisk motor och AI-lager (E9)

| Pedagogisk motor (regler) | AI-lager (variation) |
|---|---|
| Väljer vad barnet ska träna | Skapar berättelser och exempel |
| Schemalägger repetition | Förklarar ett knep på barnets nivå |
| Avgör när stöd ska minskas | Föreslår alternativa övningar inom godkända ramar |
| Registrerar resultat och osäkerhet | Ställer reflektionsfrågor om strategin |
| Styr svårighetsgrad enligt regler | Anpassar formuleringar och världens innehåll |

- **Bildbanken:** AI kan lösa flaskhalsen med illustrationer, men varje bild och uppgift
  granskas för korrekthet och ålderslämplighet innan användning. *Not: appens grafik är
  egenritad (se [design/grafik.md](design/grafik.md)); AI-genererade bilder får bara
  användas om de passar bildspråket och granskats.*
- **Förgenererat före fritt:** generera och granska i förväg, ingen fri chatt med barnet.
- **Integritet:** skickas barnets svar till en AI-tjänst krävs minimering,
  pseudonymisering och vårdnadshavares val.
