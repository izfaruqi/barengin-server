import { forbidden, notFound, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection, SelectQueryBuilder } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { DiscussionRoom } from "../entities/DiscussionRoom";
import { Group } from "../entities/Group";
import { GroupCredential } from "../entities/GroupCredential";
import { GroupMembership } from "../entities/GroupMembership";
import { User } from "../entities/User";

export async function insert(ctx: ParameterizedContext) {
  try {
    await getConnection().transaction(async trx => {
      const discussionRoom = new DiscussionRoom()
      const owner = new User()
      owner.id = ctx.state.user.id
      discussionRoom.members = [owner]
      trx.getRepository(DiscussionRoom).save(discussionRoom)
      let credentials = []
      for(let i = 0; i < ctx.request.body.slotsAvailable; i++){
        credentials.push(await trx.getRepository(GroupCredential).save(new GroupCredential()))
      }
      const res = await trx.getRepository(Group).save({ 
        name: ctx.request.body.name,
        slotsAvailable: ctx.request.body.slotsAvailable,
        rules: ctx.request.body.rules,
        groupCategory: { id: ctx.request.body.categoryId }, owner: { id: ctx.state.user.id } ,
        discussionRoom: discussionRoom,
        credentials: credentials
      })      
      ctx.body = { id: res.id }
    })
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

function safeGetGroupQuery(includeMembers: boolean = false, includeReviews: boolean = false): SelectQueryBuilder<Group>{
  const query = getConnection().getRepository(Group).createQueryBuilder("group")
    .leftJoin("group.owner", "owner")
    .leftJoin("group.members", "members")
    .leftJoinAndSelect("group.groupCategory", "groupCategory")
    // Users are limited to these 4 columns to save space.
    .addSelect("owner.firstName").addSelect("owner.lastName").addSelect("owner.id")
  if(includeMembers){
    query.addSelect("members.firstName").addSelect("members.lastName").addSelect("members.id")
  }
  if(includeReviews){
    query
      .leftJoinAndSelect("group.reviews", "reviews")
      .leftJoin("reviews.owner", "reviewsOwner")
      .addSelect("reviewsOwner.firstName").addSelect("reviewsOwner.lastName").addSelect("reviewsOwner.id")
  }
  return query
}

export async function getAllAdmin(ctx: ParameterizedContext) {
  const res = await safeGetGroupQuery(true)
    .take(parseInt(ctx.request.params.limit!)).skip(parseInt(ctx.request.params.offset!))
    .getMany()
  ctx.body = res
}

export async function getAllByCategory(ctx: ParameterizedContext) {
  const res = await safeGetGroupQuery().where("groupCategory.id = :categoryId", { categoryId: ctx.request.params.categoryId })
    .take(parseInt(ctx.request.params.limit!)).skip(parseInt(ctx.request.params.offset!))
    .getMany()
  ctx.body = res
}

async function getByIdFull(ctx: ParameterizedContext){
  const group = await safeGetGroupQuery(true, true).where("group.id = :id", { id: ctx.request.params.id }).getOne()
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
  const group = await safeGetGroupQuery(false, true).where("group.id = :id", { id: ctx.request.params.id }).getOne()
  if(!group){
    throw notFound("Group not found.")
  }
  group.reviews = group.reviews.map((review: any) => {
    if(review.anonymous){
      delete review.owner
    }
    return review
  })
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

export async function getJoined(ctx: ParameterizedContext){
  ctx.body = (await getConnection().getRepository(User).createQueryBuilder("user")
    .where("user.id = :id", { id: ctx.state.user.id })
    .leftJoinAndSelect("user.groupMemberships", "userMemberships")
    .leftJoinAndSelect("userMemberships.group", "groups")
    .leftJoin("groups.owner", "owner")
    .leftJoinAndSelect("groups.memberships", "groupMemberships")
    .leftJoin("groupMemberships.member", "members")
    .addSelect("members.id").addSelect("members.firstName").addSelect("members.lastName")
    .addSelect("owner.id").addSelect("owner.firstName").addSelect("owner.lastName")
    .getOne())?.groupMemberships
}

export async function getOwned(ctx: ParameterizedContext){
  ctx.body = (await getConnection().getRepository(User).createQueryBuilder("user")
    .where("user.id = :id", { id: ctx.state.user.id })
    .leftJoinAndSelect("user.groupsOwned", "groupsOwned")
    .leftJoin("groupsOwned.owner", "owner")
    .leftJoinAndSelect("groupsOwned.memberships", "groupMemberships")
    .leftJoin("groupMemberships.member", "members")
    .addSelect("members.id").addSelect("members.firstName").addSelect("members.lastName")
    .addSelect("owner.id").addSelect("owner.firstName").addSelect("owner.lastName")
    .getOne())?.groupsOwned
}

export async function search(ctx: ParameterizedContext){
  // Full-text search is not used because of weird bugs.
  ctx.body = await safeGetGroupQuery()
    .where("groupCategory.id = :categoryId", { categoryId: ctx.request.params.categoryId })
    .andWhere("(group.name LIKE :query OR owner.firstName LIKE :query OR owner.lastName LIKE :query)", { query: "%" + ctx.request.query.query + "%" })
    .getMany()
}

export async function revokeMembership(ctx: ParameterizedContext){
  const userId = parseInt(ctx.request.params.userId)
  const groupId = parseInt(ctx.request.params.groupId)
  const groupMembership = await getConnection().getRepository(GroupMembership).findOne({ where: { group: { id: groupId }, member: { id: userId } }, relations: ["group", "group.discussionRoom"] } )
  if(groupMembership?.group == null) throw notFound("Group membership not found.")
  await getConnection().transaction(async trx => {
    await trx.getRepository(DiscussionRoom).createQueryBuilder().relation("members").of(groupMembership.group.discussionRoom).remove(userId)
    await trx.getRepository(GroupMembership).remove(groupMembership)
  })
}

export async function deleteById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Group).softDelete(ctx.request.params.id)
  if(res.raw.affectedRows == 0){
    throw notFound("Group not found.")
  }
  ctx.body = { success: true }
}