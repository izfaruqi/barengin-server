import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { insert, getAllAdmin, getById, deleteById, editById, getAllByCategory, getJoined, getOwned } from '../controllers/group'
import { insert as insertValidator, getAll as getAllValidator, getById as getByIdValidator, editById as editByIdValidator, deleteById as deleteByIdValidator, getAllByCategory as getAllByCategoryValidator, getJoined as getJoinedValidator, getOwned as getOwnedValidator } from '../validators/group'
import isSeller from '../middlewares/isSeller'
import isAdmin from '../middlewares/isAdmin'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, isSeller, insert]
  },
  {
    method: "GET",
    path: "/",
    validate: getAllValidator.validate,
    handler: [jwt, isAdmin, getAllAdmin]
  },
  {
    method: "GET",
    path: "/joined",
    validate: getJoinedValidator.validate,
    handler: [jwt, getJoined]
  },
  {
    method: "GET",
    path: "/owned",
    validate: getOwnedValidator.validate,
    handler: [jwt, isSeller, getOwned]
  },
  {
    method: "GET",
    path: "/group-category/:categoryId",
    validate: getAllByCategoryValidator.validate,
    handler: [jwt, getAllByCategory]
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
    handler: [jwt, editById]
  },
  {
    method: "DELETE",
    path: "/:id",
    validate: deleteByIdValidator.validate,
    handler: [jwt, deleteById]
  },
]

router.route(routes)