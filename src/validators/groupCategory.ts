import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

const groupCategory = {
  id: Joi.number(),
  name: Joi.string().trim().min(1),
  description: Joi.string(),
  price: Joi.number()
}

export const insert: Config = {
  validate: {
    type: 'json',
    body: {
      name: groupCategory.name.required(),
      description: groupCategory.description,
      price: groupCategory.price.required()
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

export const getById: Config = {
  validate: {
    params: {
      id: groupCategory.id.required()
    },
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
    params: {
      id: groupCategory.id.required()
    },
    body: {
      name: groupCategory.name,
      description: groupCategory.description,
      price: groupCategory.price
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const deleteById: Config = {
  validate: {
    params: {
      id: groupCategory.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}