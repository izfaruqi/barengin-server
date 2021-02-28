import dotenv from 'dotenv'
import Koa from 'koa'
import { AddressInfo } from 'net'

dotenv.config()

const app = new Koa()

app.use(async ctx => {
  ctx.body = "Hello world"
})

const port = typeof process.env.PORT === "string"? parseInt(process.env.PORT) : false || 4000

const server = app.listen(port, process.env.HOSTNAME, undefined, () => {
  console.log("Listening on " + (server.address() as AddressInfo).address + ":" + (server.address() as AddressInfo).port)
})