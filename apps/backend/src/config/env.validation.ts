import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','test','production').default('development'),
  PORT: Joi.number().default(3000),
  CORS_ORIGIN: Joi.string().default('*'),
  API_PREFIX: Joi.string().default('api'),
  DATABASE_URL: Joi.string().uri().optional(),
});
