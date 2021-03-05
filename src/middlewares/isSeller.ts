import { Next, ParameterizedContext } from "koa"

export default async function isSeller(ctx: ParameterizedContext, next: Next){
  if(ctx.state.user.isSeller){
    await next()
  } else {
    ctx.throw(403, "Not enough privilege.")
  }
}