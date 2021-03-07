import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isSeller from '../middlewares/isSeller'
import isAdmin from '../middlewares/isAdmin'
import { insert, getById, cancelById, getCurrent } from '../controllers/transaction'
import { insert as insertValidator, getById as getByIdValidator, cancelById as cancelByIdValidator, getCurrent as getCurrentValidator } from '../validators/transaction'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, insert]
  },
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, isAdmin, getById]
  },
  {
    method: "GET",
    path: "/:id/cancel",
    validate: cancelByIdValidator.validate,
    handler: [jwt, cancelById]
  },
]

router.route(routes)