import Router from 'koa-router'
import { register } from '../controllers/user'

export const router = new Router()

router.post("/register", register)