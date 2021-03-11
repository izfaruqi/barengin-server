import { forbidden, notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection, getRepository } from "typeorm";
import { DiscussionMessage } from "../entities/DiscussionMessage";
import { Group } from "../entities/Group";

// There's no "getDiscussionRoomById" and "editDiscussionRoomById" because discussion rooms are so tightly
// bound to groups that all the metadata needed is already available in the group.

export async function getMessagesByGroupId(ctx: ParameterizedContext){
  const group = await getConnection().getRepository(Group).createQueryBuilder("group")
    .where("group.id = :id", { id: ctx.request.params.id })
    .leftJoinAndSelect("group.discussionRoom", "discussionRoom")
    .leftJoin("group.members", "members")
    .addSelect("members.id").addSelect("discussionRoom.id").getOne()
  if(group == null) throw notFound("Group not found.")
  if(!group.members.map(member => member.id).includes(ctx.state.user.id)) throw forbidden("You're not a member of this group.")

  const messages = await getConnection().getRepository(DiscussionMessage).find({ where: { room: group.discussionRoom } })
  ctx.body = messages
}