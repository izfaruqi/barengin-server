import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getMessagesByGroupId } from '../controllers/discussion'
import { getMessagesByGroupId as getMessagesByGroupIdValidator } from '../validators/discussion'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/:id",
    validate: getMessagesByGroupIdValidator.validate,
    handler: [jwt, getMessagesByGroupId]
  }
]

router.route(routes)