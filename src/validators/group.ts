import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

const group = {
  id: Joi.number(),
  categoryId: Joi.number(),
  ownerId: Joi.number(),
  name: Joi.string().trim().min(1),
}

export const insert: Config = {
  validate: {
    type: 'json',
    body: {
      name: group.name.required(),
      categoryId: group.categoryId.required()
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
      id: group.id.required()
    },
    query: {
      full: Joi.boolean()
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
      id: group.id.required()
    },
    body: {
      name: group.name,
      categoryId: group.categoryId
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
      id: group.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}