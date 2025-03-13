export interface MicroserviceConfig {
  getHttpTimeout(): number;
  getHttpMaxRedirects(): number;
  getSwapiUrl(): string;
  getWeatherUrl(): string;
  getWeatherKey(): string;
  getCountriesUrl(): string;
}
