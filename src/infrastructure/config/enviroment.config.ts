export const enviromentConfig = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN
  },
  crypto: process.env.CRYPTO_KEY,
  http: {
    timeout: process.env.HTTP_TIMEOUT,
    maxRedirects: process.env.HTTP_MAX_REDIRECTS
  },
  swapi: {
    url: process.env.SWAPI_URL
  },
  weather: {
    url: process.env.WEATHER_URL,
    key: process.env.WEATHER_KEY
  },
  countries: {
    url: process.env.COUNTRIES_URL
  },
  thorttle: {
    ttl: process.env.THROTTLE_TTL,
    limit: process.env.THROTTLE_LIMIT
  },
  redis: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    ttl: process.env.REDIS_TTL
  }
});
