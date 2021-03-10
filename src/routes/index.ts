import Router from 'koa-router'
import { router as root } from './root'
import { router as user } from './user'
import { router as groupCategory } from './groupCategory'
import { router as group } from './group'
import { router as transaction } from './transaction'
import { router as review } from './review'

export const router = new Router()

router.use('', root.middleware())
router.use('/user', user.middleware())
router.use('/group-category', groupCategory.middleware())
router.use('/group', group.middleware())
router.use('/transaction', transaction.middleware())
router.use('/review', review.middleware())