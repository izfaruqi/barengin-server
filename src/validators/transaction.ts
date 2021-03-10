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
  items: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    slotsTaken: Joi.number().min(1).default(1)
  })).min(1),
  paymentMethod: Joi.string().valid('midtrans', 'balance'),
  transactionType: Joi.string().valid('sale', 'topup')
}

export const insert: Config = {
  validate: {
    type: 'json',
    body: {
      items: transaction.items,
      topupAmount: Joi.number().min(0),
      paymentMethod: transaction.paymentMethod.required(),
      transactionType: transaction.transactionType.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const withdrawBalance: Config = {
  validate: {
    type: 'json',
    body: {
      amount: Joi.number().min(1).required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getCurrent: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getById: Config = {
  validate: {
    params: {
      id: transaction.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const cancelById: Config = {
  validate: {
    params: {
      id: transaction.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const midtransManualUpdateStatus: Config = {
  validate: {
    params: {
      id: transaction.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const midtransNotification: Config = {
  validate: {
    type: 'json',
    body: Joi.object(),
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}