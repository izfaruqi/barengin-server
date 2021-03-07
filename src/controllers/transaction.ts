import { notFound } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { Group } from "../entities/Group";
import { TransactionItem } from "../entities/TransactionItem";
import { Transaction } from "../entities/Transaction";
import { User } from "../entities/User";

function hideIdFromTransactionItems(items: any[]): any {
  return items.map(item => {
    delete item.id
    return item
  })
}

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
    item.groupCategory = item.group.groupCategory
    item.price = item.groupCategory.price
    item.name = item.group.name
    item.categoryName = item.groupCategory.name
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

// Admin only
export async function getById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Transaction).findOne({ where: { id: ctx.request.params.id }, relations: ["items", "buyer"]})
  if(res == null){
    throw notFound("Transaction not found.")
  }
  ctx.body = res
}

// Get all transactions for the logged in user
export async function getCurrent(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Transaction).find({ where: { buyer: { id: ctx.state.user.id } }, relations: ["items"]})
  if(res == null){
    throw notFound("Transaction not found.")
  }

  ctx.body = res.map(transaction => {
    transaction.items = hideIdFromTransactionItems(transaction.items) // Users dont need the ids of the transaction items.
    return transaction
  })
}

export async function cancelById(ctx: ParameterizedContext){
  const res = await getConnection().getRepository(Transaction).update(ctx.request.params.id, { cancelled: true })
  if(res == null){
    throw notFound("Transaction not found.")
  }
  ctx.body = { success: true }
}