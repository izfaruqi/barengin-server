import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getCurrent, editById, getCurrentAsSeller } from '../controllers/review'
import { getCurrent as getCurrentValidator, editById as editByIdValidator, getCurrentAsSeller as getCurrentAsSellerValidator } from '../validators/review'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/seller",
    validate: getCurrentAsSellerValidator.validate,
    handler: [jwt, getCurrentAsSeller]
  },
  {
    method: "POST",
    path: "/:id",
    validate: editByIdValidator.validate,
    handler: [jwt, editById]
  }
]

router.route(routes)