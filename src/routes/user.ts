import jwt from '../middlewares/jwt'
import Router, { Joi, Spec } from 'koa-joi-router'
import { register, login, getCurrent, getAll, getById, deleteById, editById, editCurrent, tokenSwap } from '../controllers/user'
import { register as registerValidator, login as loginValidator, tokenSwap as tokenSwapValidator, getCurrent as getCurrentValidator, getAll as getAllValidator, getById as getByIdValidator, deleteById as deleteByIdValidator } from '../validators/user'
import isAdmin from '../middlewares/isAdmin'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/register",
    validate: registerValidator.validate,
    handler: [register]
  },
  {
    method: "POST",
    path: "/login",
    validate: loginValidator.validate,
    handler: [login]
  },
  {
    method: "POST",
    path: "/tokenswap",
    validate: tokenSwapValidator.validate,
    handler: [tokenSwap]
  },
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/all",
    validate: getAllValidator.validate,
    handler: [jwt, isAdmin, getAll]
  },
  {
    method: "GET",
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, isAdmin, getById]
  },
  {
    method: "POST",
    path: "/:id",
    validate: {
      type: "json",
      body: Joi.object()
    },
    handler: [jwt, isAdmin, editById]
  },
  {
    method: "POST",
    path: "/",
    validate: {
      type: "json",
      body: Joi.object()
    },
    handler: [jwt, editCurrent]
  },
  {
    method: "DELETE",
    path: "/:id",
    validate: deleteByIdValidator.validate,
    handler: [jwt, isAdmin, deleteById]
  },
]

router.route(routes)