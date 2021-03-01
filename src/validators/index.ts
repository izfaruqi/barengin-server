import { Joi } from "koa-joi-router";

export const errorResponseValidator = {
  statusCode: Joi.number(),
  error: Joi.string(),
  message: Joi.string(),
  validation: Joi.object()
}