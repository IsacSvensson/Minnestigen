# 06 Integritet, etik och rättigheter

Utdrag ur beslutsunderlaget avsnitt E7, F5 och A5. Inget här är juridisk rådgivning –
stäm av med jurist före lansering och pilot.

## Integritet i appen (E7)

- Appen riktar sig till barn under 13 år → **vårdnadshavare samtycker**.
- **Bilder från hemmet lagras endast på enheten** (minnespalatset).
- **Inga sociala funktioner, ingen reklam, ingen spårning för profilering.**
- Gör en **konsekvensbedömning (DPIA)** och juridisk avstämning före lansering.
- Skickas barnets svar till en AI-tjänst: minimering, pseudonymisering, vårdnadshavares val.

### Så gör prototypen idag
- All data i IndexedDB på enheten ([`src/storage/`](../src/storage)). Appen är bara statiska
  filer; inget nätverksanrop görs med barnets data (e2e-testet `offline.spec.ts` kontrollerar
  att ingen trafik går till andra adresser).
- Förstagångsuppsättning kräver att vårdnadshavare bekräftar samtycke.
- Vuxenläget ligger bakom en fyrsiffrig vuxenkod (inte ett säkerhetsskydd, bara mot att barn
  råkar gå in) och har "Radera all data".
- Uppläsning använder **bara röster som finns på enheten** (`localService`). Chromes
  nätverksröster skickar texten till en server och används aldrig.
- Varje del läses på **sitt eget språk**: instruktioner med svensk röst, glosor med en röst
  på glosans språk (listan anger språk för frågor och svar). Saknas en lokal röst för språket
  hoppas ordet över hellre än att läsas med fel uttal.

## Etik i forskningen (F5)

- **Etikprövning:** forskning som syftar till att påverka deltagare psykiskt eller
  behandlar känsliga personuppgifter kräver normalt prövning hos
  Etikprövningsmyndigheten. Samarbeta med ett lärosäte som forskningshuvudman.
- **Samtycke:** under 15 år samtycker vårdnadshavare. Barnet får åldersanpassad
  information och deltar inte om det inte vill, oavsett föräldrarnas samtycke.
- **Skolan:** rektor och lärare informeras; icke-deltagare får likvärdig undervisning.
- **Data:** minimera, pseudonymisera, lagra hemmabilder lokalt, radera rådata enligt plan.
  Inga individresultat till skolan utan vårdnadshavares medgivande.
- **Lärarläge** kräver personuppgiftsbiträdesavtal med huvudmän (därför version 2).

## System, experter och rättigheter (A5)

| System/person | Bedömning |
|---|---|
| **GMS** (Giordano Memorization System, Kozarenko 1990) | Kommersiellt kurspaket utan oberoende effektstudier (N3). "Holografisk" minnesmodell saknar stöd. Delarna (figurkoder ≈ knaggar, alfanumerisk kod ≈ Major, nästlade platser ≈ avancerad loci) är allmängods. Kursmaterialet är upphovsrättsskyddat |
| Mattias Ribbing | Svensk minnesmästare (GMS-utbildad); UR:s *Plugga bättre: Minnesteknik* (åk 4–6). Visar att tekniken kan presenteras för barn – ingen utvärdering (N3) |
| Jonas von Essen | Världsmästare; *Bli ett minnesgeni!* (9–12 år), berättelser och bilder i skolämnen (N3) |
| Henrik Fexeus ("Fixeius/Fixeus") | Mentalist; demonstrerat minnesteknik i SVT; ingen egen dokumenterad metod (N3) |
| Harry Lorayne | *Se – associera – komma ihåg* passar barn |
| Martin Nilsson | Namn, platser och bilder som grundbyggstenar |

**För 6–12 år onödigt komplicerat:** fulla 00–99-system, PAO, tävlingshastighet.

### Regler för oss
- **Tekniker och idéer skyddas inte** av upphovsrätt – men texter, övningar,
  illustrationer och specifika kodtabeller kan göra det.
- **Använd inte namnen "GMS" eller "Giordano"** (varumärkesstatus ej kontrollerad).
- **Skapa egna kodtabeller, övningar och all grafik själva.**
- Lova aldrig bättre betyg, koncentration, intelligens eller effekt vid ADHD.
