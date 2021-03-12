import { notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { GroupProvider } from "../entities/GroupProvider";

export async function insert(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(GroupProvider).insert({ name: ctx.request.body.name })
  ctx.body = { id: res.identifiers[0].id }
}

export async function editById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(GroupProvider).update(ctx.request.params.id, { ...ctx.request.body })
  if(res.raw.affectedRows == 0) throw notFound("Group provider not found.")
  ctx.body = { ...ctx.request.body }
}

export async function getAll(ctx: ParameterizedContext){
  ctx.body = await getConnection().getRepository(GroupProvider).find({ relations: ["categories"] })
}

export async function deleteById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(GroupProvider).softDelete(ctx.request.params.id)
  if(res.raw.affectedRows == 0) throw notFound("Group Provider not found.")
  ctx.body = { success: true }
}