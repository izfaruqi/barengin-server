import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { GroupProvider } from "../entities/GroupProvider";

export async function insert(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(GroupProvider).insert({ name: ctx.request.body.name })
  ctx.body = { id: res.identifiers[0].id }
}

export async function getAll(ctx: ParameterizedContext){
  ctx.body = await getConnection().getRepository(GroupProvider).find()
}