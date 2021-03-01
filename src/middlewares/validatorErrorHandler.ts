import { badRequest } from "@hapi/boom";
import { Next, ParameterizedContext } from "koa";

export default async function validatorErrorHandler(ctx: ParameterizedContext, next: Next) {
  if(ctx.invalid){
    const headerErr = ctx.invalid.header?.details.map((err: { message: any; }) => err.message)
    const queryErr = ctx.invalid.query?.details.map((err: { message: any; }) => err.message)
    const paramsErr = ctx.invalid.params?.details.map((err: { message: any; }) => err.message)
    const bodyErr = ctx.invalid.body?.details.map((err: { message: any; }) => err.message)
    const boomErr = badRequest("Validation error.")
    boomErr.reformat()
    boomErr.output.payload.validation = {
      header: headerErr,
      query: queryErr,
      params: paramsErr,
      body: bodyErr,
      type: ctx.invalid.type?.message
    }
    ctx.status = boomErr.output.statusCode
    ctx.body = boomErr.output.payload
  } else {
    await next()
  }
}