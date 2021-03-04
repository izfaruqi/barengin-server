import { Config, Joi } from "koa-joi-router";
import { errorResponseValidator } from ".";

const user = {
  id: Joi.number(),
  email: Joi.string().email({ tlds: false }),
  password: Joi.string().min(8),
  firstName: Joi.string().trim().min(1),
  lastName: Joi.string().trim(),
  isAdmin: Joi.boolean(),
  isSeller: Joi.boolean(),
  emailVerified: Joi.boolean(),
  birthDate: Joi.number(),
  phone: Joi.number(),
  address: Joi.string(),
  balance: Joi.number()  
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
  }
}

export const tokenSwap: Config = {
  validate: {
    type: 'json',
    body: {
      firebaseIdToken: Joi.string().required(),
      profile: Joi.object().required()
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
      id: user.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}

export const editCurrent: Config = {
  validate: {
    type: "json",
    body: {
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      address: user.address,
      phone: user.phone,
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
    type: "json",
    params: {
      id: user.id.required()
    },
    body: {
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate,
      address: user.address,
      phone: user.phone,
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
      id: user.id.required()
    },
    output: {
      '400-599': {
        body: errorResponseValidator
      }
    },
  }
}