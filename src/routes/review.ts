import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getCurrent, editById } from '../controllers/review'
import { getCurrent as getCurrentValidator, editById as editByIdValidator } from '../validators/review'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  },
  {
    method: "POST",
    path: "/:id",
    validate: editByIdValidator.validate,
    handler: [jwt, editById]
  }
]

router.route(routes)