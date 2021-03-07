import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";
import { user } from './user'

const userSafe = Joi.object({
  id: user.id.required(),
  firstName: user.firstName.required(),
  lastName: user.lastName
})

const transactionItem = Joi.object({

})

const transaction = {
  id: Joi.number(),
  items: Joi.array().items(Joi.number())
}

export const insert: Config = {
  validate: {
    type: 'json',
    body: {
      items: transaction.items.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}