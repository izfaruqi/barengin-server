import { forbidden, notFound, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { Review } from "../entities/Review";

export async function getCurrent(ctx: ParameterizedContext){
  ctx.body = await getConnection().getRepository(Review).find({ where: { owner: { id: ctx.state.user.id }}, relations: ["group"] })
}

export async function getCurrentAsSeller(ctx: ParameterizedContext){
  ctx.body = await getConnection().getRepository(Review).createQueryBuilder("review")
    .leftJoin("review.owner", "reviewOwner")
    .leftJoin("review.group", "group")
    .leftJoin("group.owner", "owner")
    .andWhere("owner.id = :id", { id: ctx.state.user.id })
    .addSelect("reviewOwner.id").addSelect("reviewOwner.firstName").addSelect("reviewOwner.lastName")
    .getMany() 
}

export async function editById(ctx: ParameterizedContext){
  const review = await getConnection().getRepository(Review).findOne({ where: { id: ctx.request.params.id }, loadRelationIds: true })
  if(review == null) throw notFound("Review not found.")
  if(review?.owner != ctx.state.user.id) throw unauthorized("Not enough privilege.")

  const edits = ctx.request.body
  if(!review.published){
    if(edits.rating != null) review.rating = edits.rating
    if(edits.published != null) {
      review.published = edits.published
      if(edits.published){
        review.publishedAt = new Date()
      } 
    }
  } else {
    if(edits.rating != null || edits.published != null){
      throw forbidden("Can't edit rating/published when the review is already published!")
    }
  }
  if(edits.anonymous != null) review.anonymous = edits.anonymous
  if(edits.content != null) review.content = edits.content
  await getConnection().getRepository(Review).update(ctx.request.params.id, review)
  ctx.body = edits
}