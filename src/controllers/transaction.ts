import { internal, notFound, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { Group } from "../entities/Group";
import { TransactionItem } from "../entities/TransactionItem";
import { PaymentStatus, Transaction } from "../entities/Transaction";
import { User } from "../entities/User";
import axios from 'axios'

function hideIdFromTransactionItems(items: any[]): any {
  return items.map(item => {
    delete item.id
    return item
  })
}

export async function insert(ctx: ParameterizedContext) {
  await getConnection().transaction(async trx => {
    const transaction = new Transaction()
    transaction.buyer = new User(); transaction.buyer.id = ctx.state.user.id
    let totalPrice = 0
    const items: TransactionItem[] = await Promise.all(ctx.request.body.items.map(async (itemId: number) => {
      const item = new TransactionItem()
      const group = await trx.getRepository(Group).findOne({ where: { id: itemId }, relations: ["groupCategory", "owner"]})
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
      await trx.getRepository(TransactionItem).insert(item)
      return item
    }))
    transaction.items = items
    transaction.totalPrice = totalPrice
    const savedTransaction = await trx.getRepository(Transaction).save(transaction)

    const midtransData = await axios.post("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      transaction_details: {
        order_id: savedTransaction.id,
        gross_amount: savedTransaction.totalPrice
      }
    }, { timeout: 20000, auth: { username: process.env.MIDTRANS_SERVER_KEY || "", password: "" }}).then(res => res.data)
    savedTransaction.midtransRedirect = midtransData.redirect_url
    savedTransaction.expiresAt = new Date(Date.now() + (3 * 60 * 60 * 1000)) // For now, this is set manually via Snap preferences.
    await trx.getRepository(Transaction).save(savedTransaction)

    ctx.body = { id: savedTransaction.id, midtransRedirect: midtransData.redirect_url }
  })
}

export async function midtransManualUpdateStatus(ctx: ParameterizedContext){
  if(!ctx.state.user.isAdmin){
    const owner = await getConnection().getRepository(Transaction).findOne(ctx.request.params.id, { where: { buyer: { id: ctx.state.user.id }}})
    if(owner == null) {
      throw unauthorized("Transaction does not belong to this user.")
    }
  }
  const midtransData = await axios.get("https://api.sandbox.midtrans.com/v2/" + ctx.request.params.id + "/status", { timeout: 20000, auth: { username: process.env.MIDTRANS_SERVER_KEY || "", password: "" }}).then(res => res.data)
  if(midtransData.status_code == "404"){
    throw notFound("Transaction does not exist.")
  } else if(midtransData.status_code == "200"){
    await getConnection().getRepository(Transaction).update(ctx.request.params.id, { paymentStatus: PaymentStatus.SETTLED, successPayload: JSON.stringify(midtransData), midtransRedirect: undefined, paidAt: new Date(midtransData.settlement_time) })
    ctx.body = { status: PaymentStatus.SETTLED }
  } else {
    await getConnection().getRepository(Transaction).update(ctx.request.params.id, { paymentStatus: PaymentStatus.PENDING })
    ctx.body = { status: PaymentStatus.PENDING }
  }
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
  const res = await getConnection().getRepository(Transaction).update(ctx.request.params.id, { paymentStatus: PaymentStatus.CANCELLED })
  if(res == null){
    throw notFound("Transaction not found.")
  }
  ctx.body = { success: true }
}