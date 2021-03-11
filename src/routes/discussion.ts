import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import { getMessagesByGroupId, sendMessageToGroupDiscussion } from '../controllers/discussion'
import { getMessagesByGroupId as getMessagesByGroupIdValidator, sendMessageToGroupDiscussion as sendMessageToGroupDiscussionValidator } from '../validators/discussion'

export const router = Router()

const routes: Spec[] = [
  {
    method: "GET",
    path: "/:id/messages",
    validate: getMessagesByGroupIdValidator.validate,
    handler: [jwt, getMessagesByGroupId]
  },
  {
    method: "POST",
    path: "/:id/messages",
    validate: sendMessageToGroupDiscussionValidator.validate,
    handler: [jwt, sendMessageToGroupDiscussion]
  }
]

router.route(routes)