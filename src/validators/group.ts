import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

const group = {
  id: Joi.number(),
  categoryId: Joi.number(),
  ownerId: Joi.number(),
  name: Joi.string().trim().min(1),
  slotsAvailable: Joi.number(),
  rules: Joi.string(),
  credentials: Joi.string()
}

export const insert: Config = {
  validate: {
    type: 'json',
    body: {
      name: group.name.required(),
      categoryId: group.categoryId.required(),
      slotsAvailable: group.slotsAvailable.required(),
      rules: group.rules,
      credentials: group.credentials
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
    params: {
      limit: Joi.number().default(40),
      offset: Joi.number().default(0)
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getJoined: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getOwned: Config = {
  validate: {
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const getAllByCategory: Config = {
  validate: {
    params: {
      categoryId: group.categoryId.required(),
      limit: Joi.number().default(40),
      offset: Joi.number().default(0)
    },
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
      categoryId: group.categoryId,
      slotsAvailable: group.slotsAvailable,
      rules: group.rules,
      credentials: group.credentials
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const search: Config = {
  validate: {
    params: {
      categoryId: group.id.required()
    },
    query: {
      query: Joi.string().required()
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