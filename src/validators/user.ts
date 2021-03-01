import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";
import validatorErrorHandler from "../middlewares/validatorErrorHandler";

export const register: Config = {
  validate: {
    type: 'json',
    body: {
      email: Joi.string().required().email({ tlds: false }),
      password: Joi.string().required().min(8),
      firstName: Joi.string().trim().required().min(1),
      lastName: Joi.string().trim(),
      isAdmin: Joi.boolean().default(false)
    },
    output: {
      200: {
        body: {
          id: Joi.number().required()
        }
      },
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
      email: Joi.string().required().email({ tlds: false }),
      password: Joi.string().required().min(8),
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
      id: Joi.number().required()
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
      id: Joi.number().required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
    continueOnError: true
  }
}