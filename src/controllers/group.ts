import { forbidden, notFound, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Group } from "../entities/Group";

export async function insert(ctx: ParameterizedContext) {
  try {
    const res = await getConnection().getRepository(Group).insert({ 
      name: ctx.request.body.name,
      slotsAvailable: ctx.request.body.slotsAvailable,
      rules: ctx.request.body.rules,
      credentials: ctx.request.body.credentials,
      groupCategory: { id: ctx.request.body.categoryId }, owner: { id: ctx.state.user.id } 
    })
    ctx.body = { id: res.identifiers[0].id }
  } catch (err) {
    if(err.code?.startsWith("ER_NO_REFERENCED_ROW")){ // Foreign key constraint fail (invalid user/group category)
      throw forbidden("Invalid group category or owner id.")
    } else {
      throw err
    }
  }
}

export async function editById(ctx: ParameterizedContext) {
  try {
    const partialGroup: QueryDeepPartialEntity<Group> = {}
    ctx.request.body.name != null && (partialGroup.name = ctx.request.body.name)
    ctx.request.body.slotsAvailable != null && (partialGroup.slotsAvailable = ctx.request.body.slotsAvailable)
    ctx.request.body.rules != null && (partialGroup.rules = ctx.request.body.rules)
    ctx.request.body.credentials != null && (partialGroup.credentials = ctx.request.body.credentials)

    if(ctx.request.body.categoryId != null){
      partialGroup.groupCategory = { id: ctx.request.body.categoryId }
    }
    const res = await getConnection().getRepository(Group).update(ctx.request.params.id, partialGroup)
    if(res.raw.affectedRows == 0){
      throw notFound("Group not found.")
    }
    ctx.body = { ...ctx.request.body }
  } catch (err) {
    if(err.code?.startsWith("ER_NO_REFERENCED_ROW")){ // Foreign key constraint fail (invalid user/group category)
      throw forbidden("Invalid group category or owner id.")
    } else {
      throw err
    }
  }
}

function safeGetGroupQuery(includeMembers: boolean = false): SelectQueryBuilder<Group>{
  const query = getConnection().getRepository(Group).createQueryBuilder("group")
    .leftJoin("group.owner", "owner")
    .leftJoin("group.members", "members")
    .leftJoinAndSelect("group.groupCategory", "groupCategory")
    // Users are limited to these 4 columns to save space.
    .addSelect("owner.firstName").addSelect("owner.lastName").addSelect("owner.id")
  if(includeMembers){
    query.addSelect("members.firstName").addSelect("members.lastName").addSelect("members.id")
  }
  return query
}

export async function getAllAdmin(ctx: ParameterizedContext) {
  const res = await safeGetGroupQuery(true)
    .getMany()
  ctx.body = res
}

export async function getAllByCategory(ctx: ParameterizedContext) {
  const res = await safeGetGroupQuery().where("groupCategory.id = :categoryId", { categoryId: ctx.request.params.categoryId })
    .getMany()
  ctx.body = res
}

async function getByIdFull(ctx: ParameterizedContext){
  const group = await safeGetGroupQuery(true).where("group.id = :id", { id: ctx.request.params.id }).getOne()
  if(!group){
    notFound("Group not found")
  }
  if(!ctx.state.user.isAdmin && group?.owner.id != ctx.state.user.id){
    unauthorized("Not enough privilege.")
  } else {
    ctx.body = group
  }
}

async function getByIdNonFull(ctx: ParameterizedContext) {
  const group = await safeGetGroupQuery().where("group.id = :id", { id: ctx.request.params.id }).getOne()
  if(!group){
    throw notFound("Group not found.")
  }
  ctx.body = group
}

export async function getById(ctx: ParameterizedContext){
  if(ctx.request.query.full){
    if(ctx.state.user.isAdmin || ctx.state.user.isSeller){
      await getByIdFull(ctx)
    } else {
      throw unauthorized("Not enough privilege.")
    }
  } else {
    await getByIdNonFull(ctx)
  }
}

export async function deleteById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Group).softDelete(ctx.request.params.id)
  if(res.raw.affectedRows == 0){
    throw notFound("Group not found.")
  }
  ctx.body = { success: true }
}