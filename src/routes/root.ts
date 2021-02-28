import Router from 'koa-router'
import { APP_VERSION } from '../index'

export const router = new Router()

router.get("/", ctx => {
  ctx.body = { version: APP_VERSION }
})