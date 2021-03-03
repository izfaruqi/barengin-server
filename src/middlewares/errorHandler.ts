import { badImplementation, badRequest, isBoom, unauthorized } from "@hapi/boom";
import { Next, ParameterizedContext } from "koa";

export async function errorHandler(ctx: ParameterizedContext, next: Next){
  try {
    await next()
  } catch (err) {
    if(isBoom(err)){
      ctx.status = err.output.statusCode
      ctx.body = err.output.payload
    } else if(err.message == "Authentication Error") { // Error handler for malformed JWT. 
      const authErr = unauthorized("Malformed JWT.")
      ctx.status = authErr.output.statusCode
      ctx.body = authErr.output.payload
    } else if(err.name == "ValidationError") { // Error handler for Joi validation errors.
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
      console.log(err)
      const iseErr = badImplementation(err.msg || err.message)
      ctx.status = iseErr.output.statusCode
      ctx.body = iseErr.output.payload
    }
  }
}