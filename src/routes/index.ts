import Router from 'koa-router'
import { router as root } from './root'
import { router as user } from './user'

export const router = new Router()

router.use('', root.middleware())
router.use('/user', user.middleware())
