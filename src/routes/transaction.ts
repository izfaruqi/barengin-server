import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isSeller from '../middlewares/isSeller'
import isAdmin from '../middlewares/isAdmin'
import { insert, getById } from '../controllers/transaction'
import { insert as insertValidator, getById as getByIdValidator } from '../validators/transaction'

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
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, isAdmin, getById]
  },
]

router.route(routes)