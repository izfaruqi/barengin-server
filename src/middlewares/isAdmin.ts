import { Next, ParameterizedContext } from "koa";

export default async function isAdmin(ctx: ParameterizedContext, next: Next){
  if(ctx.state.user.isAdmin){
    await next()
  } else {
    ctx.throw(403, "Not enough privilege.")
  }
}