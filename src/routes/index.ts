import Router from 'koa-router'
import { router as root } from './root'
import { router as user } from './user'

export const router = new Router()

router.use('/', root.routes(), root.allowedMethods())
router.use('/user', user.routes(), user.allowedMethods())