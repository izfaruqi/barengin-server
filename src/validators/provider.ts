import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

export const insert: Config = {
  validate: {
    type: "json",
    body: {
      name: Joi.string().trim().min(1).required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getAll: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}