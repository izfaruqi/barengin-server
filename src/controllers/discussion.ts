import { forbidden, notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { DiscussionMessage } from "../entities/DiscussionMessage";
import { Group } from "../entities/Group";
import { User } from "../entities/User";

// There's no "getDiscussionRoomById" and "editDiscussionRoomById" because discussion rooms are so tightly
// bound to groups that all the metadata needed is already available in the group.

export async function getMessagesByGroupId(ctx: ParameterizedContext){
  // Might seperate this part into a function if it's used more than twice.
  const group = await getConnection().getRepository(Group).createQueryBuilder("group")
    .where("group.id = :id", { id: ctx.request.params.id })
    .leftJoinAndSelect("group.discussionRoom", "discussionRoom")
    .leftJoin("discussionRoom.members", "members")
    .addSelect("members.id").addSelect("discussionRoom.id").getOne()
  if(group == null) throw notFound("Group not found.")
  if(!group.discussionRoom.members.map(member => member.id).includes(ctx.state.user.id) && !ctx.state.user.isAdmin) throw forbidden("You're not a member of this group.")

  const messages = await getConnection().getRepository(DiscussionMessage).find({ where: { room: group.discussionRoom } })
  ctx.body = messages
}

export async function sendMessageToGroupDiscussion(ctx: ParameterizedContext){
  const group = await getConnection().getRepository(Group).createQueryBuilder("group")
    .where("group.id = :id", { id: ctx.request.params.id })
    .leftJoinAndSelect("group.discussionRoom", "discussionRoom")
    .leftJoin("discussionRoom.members", "members")
    .addSelect("members.id").addSelect("discussionRoom.id").getOne()
  if(group == null) throw notFound("Group not found.")
  if(!group.discussionRoom.members.map(member => member.id).includes(ctx.state.user.id)) throw forbidden("You're not a member of this group.")

  const message = new DiscussionMessage()
  message.room = group.discussionRoom
  message.sender = new User; message.sender.id = ctx.state.user.id
  message.content = ctx.request.body.content
  message.sentAt = new Date()
  const res = await getConnection().getRepository(DiscussionMessage).insert(message)
  ctx.body = { id: res.identifiers[0].id }
}