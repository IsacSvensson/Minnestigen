# Minnesstigen

En forskningsbaserad app som lär barn 6–12 år att **välja, använda och utvärdera
minnesstrategier** i skolan och vardagen. Kärnan är hämtningsövning med återkoppling och
utspridd repetition; minnestekniker (grupper, bilder, berättelser, minnespalats) är
verktyg ovanpå.

> *"Det här behöver jag komma ihåg. Jag gör en bild av det, testar mig själv senare och
> kollar om jag fortfarande kan det."*

> **Spela:** https://isacsvensson.github.io/Minnestigen/
>
> Fungerar offline efter första besöket och kan läggas på hemskärmen. Ingen data lämnar
> enheten.

## Kom igång

```bash
npm install
npm run dev        # öppna http://localhost:5173
npm test           # enhetstester
npm run e2e        # webbläsartester
```

Bara klient: statisk PWA i vanilla TypeScript, publicerad på GitHub Pages från
standardgrenen. Uppsättningen följer systerprojektet
[Mattedalen](https://github.com/IsacSvensson/Mattedalen).

## Vad som finns nu (M1)

- **Steg 0 – Gissa och pröva:** titta på sex bilder, gissa hur många du minns, testa, jämför.
- **Steg 1 – Göm och säg:** titta → göm → säg eller välj → kolla, med ledtrådsstege.
- **Uppvärmning** med det som repetitionsschemat säger är på tur, **reflektion** om
  strategin och ett **vardagsuppdrag**.
- **Mönsterskogen:** varje genomfört pass tänder en lykta längs stigen.
- **Vuxenläge:** lägg in skolans glosor och tabeller, se lärandeprofilen, radera data.
- All grafik egenritad; all data stannar på enheten (IndexedDB); fungerar offline.

## Dokumentation

- [docs/](docs/README.md) – forskningsgrund, metod, appkoncept, mätning, integritet
- [Produktregler](docs/produktregler.md) – det som aldrig får brytas
- [Plan](docs/PLAN.md) · [Arbetssätt](docs/ARBETSSATT.md) · [Beslut](docs/adr/)
- [Originalunderlag (PDF)](docs/underlag/)
