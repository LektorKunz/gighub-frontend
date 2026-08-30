# GigHub — facit-frontend

Model-løsning (facit) for Angular-delen af 3. semester-forløbet "GigHub" — se
`../design-brief.md` for hele casen (domænemodel, forretningsregler, tech-stack) og
`../00-oversigt-og-underviserguide.md` for undervisningsplanen.

Dette projekt er sluttilstanden efter **gang 08 (uge 44)**: alle frontend-features fra
gang 02, 04, 05, 06, 07 og 08 er med. Gang 01, 03, 09 og 10 tilføjer ingen ny frontend
(se tabellen i design-brief.md, afsnit 4) og er derfor ikke repræsenteret som separate trin —
koden herunder er det færdige resultat, ikke en gang-for-gang commit-historik.

## Sådan kører du projektet

Forudsætning: Node.js (se `Bemærkninger og antagelser` nedenfor) og npm.

```bash
npm install
npm start        # svarer til `ng serve` — kører på http://localhost:4200
```

Backend forventes at køre lokalt samtidig — se `../facit-backend` (hvis/når den findes) og
kør den med `dotnet run`. **CORS skal være åbnet på backend for Angular-devserverens origin**
(`http://localhost:4200`), ellers fejler alle HttpClient-kald i browserens konsol med en
CORS-fejl, der let forveksles med en almindelig netværksfejl (en af de "tavse fejl" nævnt i
design-brief.md, afsnit 6).

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
udgangspunkt bruger til HTTPS i .NET 10-skabelonen. Den faktiske port for facit-backend står i
`facit-backend/Properties/launchSettings.json` (feltet `applicationUrl`) — ret `apiUrl` i begge
environment-filer, hvis den afviger.

## Filer/komponenter pr. undervisningsgang

| Gang | Uge | Nyt i frontend (jf. design-brief.md afsnit 4) | Filer i dette projekt |
|---|---|---|---|
| 02 | 37 | `EventService` (HttpClient), `EventListComponent` (signals, `@for`), `environment.ts` med `apiUrl` | `src/app/services/event.service.ts`, `src/app/components/event-list/*`, `src/environments/*`, `src/app/models/event.model.ts` |
| 03 | 38 | (ingen ny frontend — fokus er backend/EF Core) | — |
| 04 | 39 | `EventFormComponent` (reactive forms), `BookingButtonComponent` | `src/app/components/event-form/*`, `src/app/components/booking-button/*`, `src/app/services/booking.service.ts`, `src/app/models/booking.model.ts` |
| 05 | 41 | Filter/søgefelt bundet til query-params, pagination-komponent | `src/app/components/pagination/*`, filter-form + query-param-binding i `src/app/components/event-list/event-list.component.ts`, `EventQueryParams`/`PagedResult` i `src/app/models/event.model.ts` |
| 06 | 42 | `AuthService`, `LoginComponent`/`RegisterComponent`, funktionsbaseret `authInterceptor`, `authGuard` | `src/app/services/auth.service.ts`, `src/app/components/login/*`, `src/app/components/register/*`, `src/app/core/interceptors/auth-interceptor.ts`, `src/app/core/guards/auth-guard.ts`, `src/app/models/user.model.ts`, registrering i `src/app/app.config.ts` |
| 07 | 43 | `ReviewListComponent`, stjerne-rating, betinget visning (kun hvis brugeren har været booket) | `src/app/components/review-list/*`, `src/app/components/star-rating/*`, `src/app/services/review.service.ts`, `src/app/models/review.model.ts` |
| 08 | 44 | Favorit-hjerte-knap (toggle), billedupload-komponent til events | `src/app/components/favorite-button/*`, `src/app/components/image-upload/*`, `addFavorite`/`removeFavorite`/`uploadImage` i `src/app/services/event.service.ts` |
| 09–10 | 46–47 | (ingen ny frontend — test/opsamling/afsluttende opgave) | — |

`src/app/components/nav-bar/*` (login-status og navigation i app-shell'en) og
`src/app/app.routes.ts`/`src/app/app.config.ts`/`src/app/app.ts` hører ikke til én bestemt
gang — de er "limen", der binder komponenterne fra ovenstående gange sammen til én app, og
udbygges løbende efterhånden som ruter tilføjes (fx `authGuard` på `/events/new` fra gang 06).

## Bevidst stilladsering, som går igen i koden

- **Gang 04 → 06-refactor:** `BookingService.create(eventId)` tager i dette facit **ikke**
  et `userId`-argument — det er allerede den "efter gang 06"-version, hvor backend læser
  brugeren fra JWT-claims. Se `../design-brief.md` afsnit 4 for den bevidste "fake-bruger"
  mellemtilstand, som gang 04's egen dagsplan/øvelse bygger op til, før refactoren vises.
- **Dobbelt-booking (409):** `BookingButtonComponent` viser en brugervenlig besked ved et
  409-svar frem for at lade en rå fejl boble op — jf. forretningsregel 3 i design-brief.md.
- **Anmeldelse kræver deltagelse:** `ReviewListComponent` gætter klient-side på, om
  formularen bør vises (baseret på brugerens egne bookinger), men **backend er stadig
  autoritativ** — et forsøg på at anmelde et event, man reelt ikke har deltaget i, skal
  stadig afvises server-side.

## Teknisk stak i dette projekt

- **Angular 20.3** (standalone components, signals, ny control-flow `@if`/`@for`, `inject()`).
  Design-briefen antager Angular 22 som nyeste stabile, men environmentet her kunne kun
  installere Node.js v22.22.2, som er lige under den `^22.22.3`-grænse, Angular CLI 22 kræver
  — se `Bemærkninger og antagelser` nedenfor. Alle mønstre (signals, ny control-flow,
  funktionsbaserede interceptors/guards) har ifølge design-briefen været stabile siden
  Angular 17-20, så facit-koden er retvisende for undervisningen uafhængigt af den præcise
  patch-version.
- `provideHttpClient(withFetch(), withInterceptors([authInterceptor]))` i `app.config.ts`.
- Reactive forms (`ReactiveFormsModule`) i `EventFormComponent`, `LoginComponent`,
  `RegisterComponent`, `ReviewListComponent`.
- Alle komponenter er **standalone** og bruger **funktionsbaserede** interceptor/guard
  (`HttpInterceptorFn`, `CanActivateFn`) — ikke de ældre klassebaserede mønstre.

## Bemærkninger og antagelser (bør tjekkes af underviser/bruger)

1. **API-port:** `apiUrl: 'https://localhost:5001/api'` er en antagelse (standard HTTPS-port
   i .NET's projektskabelon) — der findes ikke en `facit-backend`-mappe i dette repo endnu, så
   den faktiske port kunne ikke verificeres mod en rigtig `launchSettings.json`. Ret i
   `src/environments/*.ts`, hvis backend-facitten ender med en anden port.
2. **Angular-version:** Se afsnittet ovenfor — projektet blev scaffoldet med Angular CLI 20,
   fordi environmentets Node.js-version (v22.22.2) er én patch-version under det, Angular
   CLI 22 kræver (`^22.22.3`). Opgradér Node og kør `ng update` til Angular 22, hvis det
   ønskede undervisningsmiljø skal matche design-briefens "Angular 22" 1:1.
3. **`GET /api/bookings/me`:** `BookingService.getMyBookings()` antager et endpoint, der
   returnerer den indloggede brugers egne bookinger (brugt af `ReviewListComponent` til at
   afgøre, om anmeldelses-formularen skal vises). Dette endpoint er ikke eksplicit nævnt i
   design-briefens endpoint-tabel — tjek at det findes i facit-backend, eller tilpas
   frontend'en til det endpoint, backend faktisk eksponerer.
4. **`averageRating`/`bookedCount`/`isFavorite`:** disse felter på `GighubEvent`
   (`src/app/models/event.model.ts`) antages leveret direkte af backend som en del af
   event-DTO'en (jf. "GET /api/events/{id} inkl. gennemsnitsrating" i design-briefens
   endpoint-tabel for gang 07). Tjek at feltnavnene matcher 1:1 med den faktiske C#-DTO.

## Verificeret build

`npx ng build` (produktionskonfiguration) og `npx ng build --configuration development` er
begge kørt igennem uden fejl eller advarsler i dette environment — se commit-historikken/
build-loggen for detaljer. Output ligger i `dist/facit-frontend` (ikke committet — se
`.gitignore`).
