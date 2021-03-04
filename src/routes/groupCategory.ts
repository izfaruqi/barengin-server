import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isAdmin from '../middlewares/isAdmin'
import { getAll, insert, getById, editById } from '../controllers/groupCategory'
import { insert as insertValidator, getAll as getAllValidator, getById as getByIdValidator, editById as editByIdValidator } from '../validators/groupCategory'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, isAdmin, insert]
  },
  {
    method: "GET",
    path: "/",
    validate: getAllValidator.validate,
    handler: [jwt, getAll]
  },
  {
    method: "GET",
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, getById]
  },
  {
    method: "POST",
    path: "/:id",
    validate: editByIdValidator.validate,
    handler: [jwt, isAdmin, editById]
  }
]

router.route(routes)