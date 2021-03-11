import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

const oneMonth = (30 * 24 * 60 * 60 * 1000)

export const getMessagesByGroupId: Config = {
  validate: {
    params: {
      id: Joi.number().required()
    },
    query: {
      since: Joi.number().default(Date.now() - oneMonth),
      until: Joi.number().default(Date.now())
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