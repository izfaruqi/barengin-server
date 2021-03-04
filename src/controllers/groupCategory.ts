import { notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { GroupCategory } from '../entities/GroupCategory'

export async function insert(ctx: ParameterizedContext) {
  const res = await getConnection().getRepository(GroupCategory).insert({ ...ctx.request.body })
  ctx.body = { id: res.identifiers[0].id }
}

export async function getAll(ctx: ParameterizedContext) {
  const res = await getConnection().getRepository(GroupCategory).find()
  ctx.body = res
}

export async function getById(ctx: ParameterizedContext) {
  const res = await getConnection().getRepository(GroupCategory).findOne({ where: { id: ctx.request.params.id }})
  if(res == null){
    throw notFound("Group category not found.")
  }
  ctx.body = res
}

export async function editById(ctx: ParameterizedContext) {
  const partialGroupCategory: QueryDeepPartialEntity<GroupCategory> = {
    ...ctx.request.body
  }
  const res = await getConnection().getRepository(GroupCategory).update(ctx.request.params.id, partialGroupCategory)
  if(res.raw.affectedRows == 0){
    throw notFound("Group category not found.")
  }
  ctx.body = ctx.request.body
}

export async function deleteById(ctx: ParameterizedContext) {
  const res = await getConnection().getRepository(GroupCategory).softDelete(ctx.request.params.id)
  if(res.raw.affectedRows == 0){
    throw notFound("Group category not found.")
  }
  ctx.body = { success: true }
}