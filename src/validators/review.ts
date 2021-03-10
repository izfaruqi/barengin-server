import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

export const getCurrent: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const editById: Config = {
  validate: {
    type: 'json',
    body: {
      rating: Joi.number().min(1).max(5),
      content: Joi.string(),
      published: Joi.boolean(),
      anonymous: Joi.boolean()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}