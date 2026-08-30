# GigHub - frontend

## Sådan kører du projektet

Forudsætning: Node.js (se `Bemærkninger og antagelser` nedenfor) og npm.

```bash
npm install
npm start        # svarer til `ng serve` — kører på http://localhost:4200
```


Andre kommandoer:

```bash
npm run build     # `ng build` — produktionsbuild i dist/facit-frontend (verificeret, se nedenfor)
npm test          # `ng test` — Karma/Jasmine unit-tests
```

## Konfiguration af API-URL

`src/environments/environment.ts` (brugt af produktionsbuild) og
`src/environments/environment.development.ts` (brugt automatisk af `ng serve` via
`fileReplacements` i `angular.json`) indeholder begge:

```ts
export const environment = {
  production: false, // true i environment.ts
  apiUrl: 'https://localhost:5001/api',
};
```

**Antagelse, som bør tjekkes:** `https://localhost:5001` er den port, ASP.NET Core som
udgangspunkt bruger til HTTPS i .NET 10-skabelonen. Den faktiske port for backend står i
`gighub-backend/Properties/launchSettings.json` (feltet `applicationUrl`) — ret `apiUrl` i begge
environment-filer, hvis den afviger.

