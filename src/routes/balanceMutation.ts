import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getCurrent } from '../controllers/balanceMutation'
import { getCurrent as getCurrentValidator } from '../validators/balanceMutation'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  }
]

router.route(routes)