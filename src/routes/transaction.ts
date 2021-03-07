import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isSeller from '../middlewares/isSeller'
import isAdmin from '../middlewares/isAdmin'
import { insert } from '../controllers/transaction'
import { insert as insertValidator } from '../validators/transaction'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, insert]
  },
]

router.route(routes)