import Koa from 'koa'
import Helmet from 'koa-helmet'
import BetterErrorHandler from 'koa-better-error-handler'
import { AddressInfo } from 'net'
import { router } from './routes'

export default async function initServer(){
  const app = new Koa()

  app.context.api = true
  app.context.onerror = BetterErrorHandler() // TODO: Replace with DIY error handler
  app.use(Helmet())
  app.use(async (ctx, next) => {
    ctx.state.secret = process.env.JWT_SECRET!
    await next()
  })

  app.use(router.routes())

  const port = typeof process.env.PORT === "string"? parseInt(process.env.PORT) : false || 4000

  const server = app.listen(port, process.env.HOSTNAME, undefined, () => {
    console.log("Listening on " + (server.address() as AddressInfo).address + ":" + (server.address() as AddressInfo).port)
  })

  return server
}