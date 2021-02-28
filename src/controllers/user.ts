import { ParameterizedContext } from "koa";

import { getConnection } from 'typeorm'
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

import bcrypt from 'bcrypt'

const BCRYPT_ROUNDS = 13

export async function register(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    email: ctx.request.body.email,
    password: await bcrypt.hash(ctx.request.body.password, BCRYPT_ROUNDS)
  }
  try {
    const res = await getConnection().getRepository(User).insert(user)
    ctx.body = { id: res.identifiers[0].id }
  } catch (e: any){
    switch(e.code){
      case "ER_DUP_ENTRY":
        ctx.throw(403, e)
      default:
        ctx.throw(500, e)
    }
  }
}