import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";
import validatorErrorHandler from "../middlewares/validatorErrorHandler";

const user = {
  id: Joi.number(),
  email: Joi.string().email({ tlds: false }),
  password: Joi.string().min(8),
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim(),
  isAdmin: Joi.boolean().default(false)

}

export const register: Config = {
  validate: {
    type: 'json',
    body: {
      email: user.email.required(),
      password: user.password.required(),
      firstName: user.firstName.required(),
      lastName: user.lastName.required(),
      isAdmin: user.isAdmin
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}

export const login: Config = {
  validate: {
    type: 'json',
    body: {
      email: user.email.required(),
      password: user.password.required(),
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}

export const getCurrent: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}

export const getAll: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}

export const getById: Config = {
  validate: {
    params: {
      id: user.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}

export const deleteById: Config = {
  validate: {
    params: {
      id: user.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}