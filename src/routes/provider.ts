import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getAll, insert } from '../controllers/provider'
import { getAll as getAllValidator, insert as insertValidator } from '../validators/provider'
import isAdmin from '../middlewares/isAdmin'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/",
    validate: getAllValidator.validate,
    handler: [getAll]
  },
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, isAdmin, insert]
  }
]

router.route(routes)