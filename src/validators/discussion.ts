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

export const sendMessageToGroupDiscussion: Config = {
  validate: {
    type: "json",
    params: {
      id: Joi.number().required()
    },
    body: {
      content: Joi.string().min(1).required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}