import { badRequest, forbidden, notFound, paymentRequired, unauthorized } from "@hapi/boom";
import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { Group } from "../entities/Group";
import { TransactionItem } from "../entities/TransactionItem";
import { PaymentMethod, PaymentStatus, Transaction, TransactionType } from "../entities/Transaction";
import { User } from "../entities/User";
import axios from 'axios'
import crypto from 'crypto'

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
    if(ctx.request.body.transactionType == TransactionType.TOPUP){
      transaction.transactionType = TransactionType.TOPUP
      totalPrice = ctx.request.body.topupAmount
    } else {
      transaction.transactionType = TransactionType.SALE
      if(ctx.request.body.items == null || ctx.request.body.items.length < 1){
        throw badRequest("Must have at least 1 item.")
      }
      transaction.items = await Promise.all(ctx.request.body.items.map(async (itemId: number) => {
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
    }
    transaction.totalPrice = totalPrice
    transaction.expiresAt = new Date(Date.now() + (3 * 60 * 60 * 1000)) // For now, this is set manually via Snap preferences.
    const savedTransaction = await trx.getRepository(Transaction).save(transaction)

    if(ctx.request.body.paymentMethod == PaymentMethod.MIDTRANS){
      const midtransData = await axios.post("https://app.sandbox.midtrans.com/snap/v1/transactions", {
        transaction_details: {
          order_id: savedTransaction.id,
          gross_amount: savedTransaction.totalPrice
        }
      }, { timeout: 20000, auth: { username: process.env.MIDTRANS_SERVER_KEY || "", password: "" }}).then(res => res.data)
      savedTransaction.midtransRedirect = midtransData.redirect_url
      savedTransaction.paymentMethod = PaymentMethod.MIDTRANS
      await trx.getRepository(Transaction).save(savedTransaction)

      ctx.body = { id: savedTransaction.id, midtransRedirect: midtransData.redirect_url }
    } else if(ctx.request.body.paymentMethod == PaymentMethod.BALANCE){
      if(ctx.request.body.transactionType == TransactionType.TOPUP){
        throw forbidden("Cant top up with balance!")
      }
      await trx.getRepository(User).decrement({ id: ctx.state.user.id }, "balance", totalPrice)
      if((await trx.getRepository(User).findOne(ctx.state.user.id, { select: ["balance"]}))!.balance < 0){
        throw paymentRequired("Insufficient balance.")
      }
      await trx.getRepository(Transaction).update(savedTransaction.id, { paidAt: new Date(), paymentStatus: PaymentStatus.SETTLED, paymentMethod: PaymentMethod.BALANCE, successPayload: ""})
      await settleTransaction(savedTransaction.id)
      ctx.body = { id: savedTransaction.id }
    }
  })
}

export async function midtransManualUpdateStatus(ctx: ParameterizedContext){
  const transactionData = await getConnection().getRepository(Transaction).findOne(ctx.request.params.id, { where: { buyer: { id: ctx.state.user.id }}})
  if(!ctx.state.user.isAdmin){
    if(transactionData == null) {
      throw unauthorized("Transaction does not belong to this user.")
    }
  }
  if(transactionData?.paymentStatus == PaymentStatus.PENDING){
    const midtransData = await axios.get("https://api.sandbox.midtrans.com/v2/" + ctx.request.params.id + "/status", { timeout: 20000, auth: { username: process.env.MIDTRANS_SERVER_KEY || "", password: "" }}).then(res => res.data)
    if(midtransData.status_code == "404"){
      throw notFound("Transaction does not exist.")
    } else if(midtransData.status_code == "200"){
      await getConnection().getRepository(Transaction).update(ctx.request.params.id, { paymentStatus: PaymentStatus.SETTLED, successPayload: JSON.stringify(midtransData), midtransRedirect: undefined, paidAt: new Date(midtransData.settlement_time) })
      await settleTransaction(parseInt(ctx.request.params.id))
      ctx.body = { status: PaymentStatus.SETTLED }
    } else {
      await getConnection().getRepository(Transaction).update(ctx.request.params.id, { paymentStatus: PaymentStatus.PENDING })
      ctx.body = { status: PaymentStatus.PENDING }
    }
  } else {
    throw forbidden("Transaction is not eligible for rechecking.")
  } 
}

export async function midtransNotification(ctx: ParameterizedContext){
  console.log("Midtrans notification: " + ctx.request.body.order_id)
  const transactionId = parseInt(ctx.request.body.order_id)
  const { status_code, gross_amount, signature_key } = ctx.request.body
  const expectedHash = crypto.createHash('sha512').update(ctx.request.body.order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY).digest("hex")
  if(expectedHash == signature_key){
    if(status_code == "200"){
      if((await getConnection().getRepository(Transaction).findOne({ id: ctx.request.body.order_id }, { select: ["paymentStatus"] }))?.paymentStatus != PaymentStatus.SETTLED)
      console.log("Midtrans settlement: " + ctx.request.body.order_id)
      await getConnection().getRepository(Transaction).update(transactionId, { paymentStatus: PaymentStatus.SETTLED, successPayload: JSON.stringify(ctx.request.body), midtransRedirect: undefined, paidAt: new Date(ctx.request.body.settlement_time) })
      await settleTransaction(transactionId)
      ctx.body = { status: PaymentStatus.SETTLED }
    }
  } else {
    throw forbidden("Signature key mismatch.")
  }
}

async function settleTransaction(transactionId: number){
  const transactionDetails = (await getConnection().getRepository(Transaction).findOne(transactionId, { relations: ["items", "buyer"] }))!
  if(transactionDetails.transactionType == TransactionType.TOPUP){
    await getConnection().getRepository(User).increment({ id: transactionDetails.buyer.id }, "balance", transactionDetails.totalPrice)
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