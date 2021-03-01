import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { register, login, getCurrent, getAll, getById, deleteById } from '../controllers/user'
import { register as registerValidator, login as loginValidator, getCurrent as getCurrentValidator, getAll as getAllValidator, getById as getByIdValidator, deleteById as deleteByIdValidator } from '../validators/user'
import isAdmin from '../middlewares/isAdmin'
import validatorErrorHandler from '../middlewares/validatorErrorHandler'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/register",
    validate: registerValidator.validate,
    handler: [validatorErrorHandler, register]
  },
  {
    method: "POST",
    path: "/login",
    validate: loginValidator.validate,
    handler: [validatorErrorHandler, login]
  },
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [validatorErrorHandler, jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/all",
    validate: getAllValidator.validate,
    handler: [validatorErrorHandler, jwt, isAdmin, getAll]
  },
  {
    method: "GET",
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [validatorErrorHandler, jwt, isAdmin, getById]
  },
  {
    method: "DELETE",
    path: "/:id",
    validate: deleteByIdValidator.validate,
    handler: [validatorErrorHandler, jwt, isAdmin, deleteById]
  },
]

router.route(routes)