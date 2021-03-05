import { forbidden, notFound, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection, SelectQueryBuilder } from "typeorm";
import { Group } from "../entities/Group";

export async function insert(ctx: ParameterizedContext) {
  try {
    console.log(ctx.state.user.id)
    const res = await getConnection().getRepository(Group).insert({ name: ctx.request.body.name, groupCategory: { id: ctx.request.body.categoryId }, owner: { id: ctx.state.user.id } })
    ctx.body = { id: res.identifiers[0].id }
  } catch (err) {
    if(err.code.startsWith("ER_NO_REFERENCED_ROW")){ // Foreign key constraint fail (invalid user/group category)
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