import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

export const getMessagesByGroupId: Config = {
  validate: {
    params: {
      id: Joi.number().required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}