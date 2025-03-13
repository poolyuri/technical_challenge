import * as Joi from 'joi';

export const validationConfig = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
  CRYPTO_KEY: Joi.string().required(),
  HTTP_TIMEOUT: Joi.number().required(),
  HTTP_MAX_REDIRECTS: Joi.number().required(),
  SWAPI_URL: Joi.string().required(),
  WEATHER_URL: Joi.string().required(),
  WEATHER_KEY: Joi.string().required(),
  COUNTRIES_URL: Joi.string().required(),
  THROTTLE_TTL: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),
  REDIS_URL: Joi.string().ip().required(),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_TTL: Joi.string().default('30m').required()
});
