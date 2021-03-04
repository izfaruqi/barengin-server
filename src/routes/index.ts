import Router from 'koa-router'
import { router as root } from './root'
import { router as user } from './user'
import { router as groupCategory } from './groupCategory'

export const router = new Router()

router.use('', root.middleware())
router.use('/user', user.middleware())
router.use('/group-category', groupCategory.middleware())
