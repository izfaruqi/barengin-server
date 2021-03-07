import { notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { Group } from "../entities/Group";
import { TransactionItem } from "../entities/TransactionItem";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

export async function insert(ctx: ParameterizedContext) {
  const transaction = new Transaction()
  transaction.buyer = new User(); transaction.buyer.id = ctx.state.user.id
  transaction.totalPrice = 0
  transaction.items = ctx.request.body.items.map(async (itemId: number) => {
    const item = new TransactionItem()
    const group = await getConnection().getRepository(Group).findOne({ where: { id: itemId }, relations: ["groupCategory", "owner"]})
    if(group == undefined){
      throw notFound("Group with id " + itemId + " not found.")
    }
    item.group = group!
    item.seller = item.group.owner
    item.price = item.group.groupCategory.price
    item.name = item.group.name
    item.transaction = transaction
    getConnection().getRepository(TransactionItem).save(item)
    transaction.totalPrice += item.price
  })
  const res = await getConnection().getRepository(Transaction).insert(transaction)
  ctx.body = { id: res.identifiers[0].id }
}