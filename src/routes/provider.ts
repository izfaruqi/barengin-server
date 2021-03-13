import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { deleteById, editById, getAll, insert } from '../controllers/provider'
import { getAll as getAllValidator, insert as insertValidator, editById as editByIdValidator, deleteById as deleteByIdValidator } from '../validators/provider'
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
  },
  {
    method: "POST",
    path: "/:id",
    validate: editByIdValidator.validate,
    handler: [jwt, isAdmin, editById]
  },
  {
    method: "DELETE",
    path: "/:id",
    validate: deleteByIdValidator.validate,
    handler: [jwt, isAdmin, deleteById]
  }
]

router.route(routes)