import * as Joi from 'joi'

export const ENV_SCHEMA = Joi.object({
  DATABASE_URL: Joi.string(),
  PORT: Joi.number().default(4000),
  BACKEND_URL: Joi.string().default('http://localhost'),
  CLIENT_ID: Joi.string(),
  BASE_MUSIC_API_URL: Joi.string(),
  JWT_SECRET: Joi.string(),
  FRONTEND_URL: Joi.string().default('http://localhost:3000')
})
