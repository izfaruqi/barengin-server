import jwt from '../middlewares/jwt'
import Router from 'koa-router'
import { register, login, getCurrent } from '../controllers/user'

export const router = new Router()

router.post("/register", register)
router.post("/login", login)
router.get("/", jwt, getCurrent)