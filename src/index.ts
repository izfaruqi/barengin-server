import dotenv from 'dotenv'
import 'reflect-metadata'
import Koa from 'koa'
import Helmet from 'koa-helmet'
import BodyParser from 'koa-bodyparser'
import BetterErrorHandler from 'koa-better-error-handler'
import { AddressInfo } from 'net'
import { router } from './routes'
import initDB from './db'

export const APP_VERSION = "0.1.0"
dotenv.config()

const app = new Koa()

app.context.api = true
app.context.onerror = BetterErrorHandler()
app.use(Helmet())
app.use(BodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

const port = typeof process.env.PORT === "string"? parseInt(process.env.PORT) : false || 4000

initDB().then(_ => {
  const server = app.listen(port, process.env.HOSTNAME, undefined, () => {
    console.log("Listening on " + (server.address() as AddressInfo).address + ":" + (server.address() as AddressInfo).port)
  })
})