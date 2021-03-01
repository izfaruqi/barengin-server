import jwt from '../middlewares/jwt'
import Router from 'koa-router'
import { register, login, getCurrent, getAll } from '../controllers/user'
import isAdmin from '../middlewares/isAdmin'

export const router = new Router()

router.post("/register", register)
router.post("/login", login)
router.get("/", jwt, getCurrent)
router.get("/all", jwt, isAdmin, getAll)