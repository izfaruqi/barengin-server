import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { register, login, getCurrent, getAll, getById, deleteById } from '../controllers/user'
import isAdmin from '../middlewares/isAdmin'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/register",
    handler: register
  },
  {
    method: "POST",
    path: "/login",
    handler: login
  },
  {
    method: "GET",
    path: "/",
    handler: [jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/all",
    handler: [jwt, isAdmin, getAll]
  },
  {
    method: "GET",
    path: "/:id",
    handler: [jwt, isAdmin, getById]
  },
  {
    method: "DELETE",
    path: "/:id",
    handler: [jwt, isAdmin, deleteById]
  },
]

router.route(routes)