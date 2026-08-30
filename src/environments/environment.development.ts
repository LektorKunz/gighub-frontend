// Udviklings-miljø. Bruges automatisk af `ng serve` / `npm start` (fileReplacements i angular.json).
// Antagelse: backend (facit-backend) kører lokalt via `dotnet run` på https://localhost:5001.
// Tjek den faktiske port i facit-backend/Properties/launchSettings.json og ret her, hvis den afviger.
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api',
};
