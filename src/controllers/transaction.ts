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
  let totalPrice = 0
  const items: TransactionItem[] = await Promise.all(ctx.request.body.items.map(async (itemId: number) => {
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
    totalPrice += item.price
    await getConnection().getRepository(TransactionItem).insert(item)
    return item
  }))
  transaction.items = items
  transaction.totalPrice = totalPrice
  const res = await getConnection().getRepository(Transaction).save(transaction)
  ctx.body = { id: res.id }
}

export async function getById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Transaction).findOne({ where: { id: ctx.request.params.id }, relations: ["items"]})
  if(res == null){
    throw notFound("Transaction not found.")
  }
  ctx.body = res
}