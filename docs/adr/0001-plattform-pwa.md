# ADR 0001 – Plattform: PWA med React, TypeScript och Vite

**Status:** Beslutad (2026-10-18) · kan omprövas inför M5

## Sammanhang
Version 1 ska räcka för att pröva kärnan i en pilot med barn 6–12 år, i skolan (ofta
surfplattor) och hemma (föräldrars telefoner). Integritet kräver att data stannar på
enheten. Vi vill iterera snabbt och kunna dela en testversion utan appbutiker.

## Beslut
- Webbapp som **PWA** (installérbar, offline i M2) byggd med **React + TypeScript + Vite**.
- Den pedagogiska motorn skrivs som **ren TypeScript utan UI-beroenden**
  (se [ADR 0003](0003-regelstyrd-motor.md)), så den kan flyttas till en butiksapp
  (t.ex. Capacitor eller React Native) utan omskrivning.

## Konsekvenser
- + Snabb utveckling, en kodbas för alla enheter, enkel distribution till pilotklasser.
- + Inget konto eller server behövs för version 1.
- − Talsyntes och lagring varierar mellan webbläsare (iOS Safari kan rensa lagring efter
  lång inaktivitet) → inspelade röster och ev. butiksapp utvärderas i M5.
- − Kamera för minnespalatset sker via webbläsarens filväljare (räcker för M4).
