import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isAdmin from '../middlewares/isAdmin'
import { insert, getById, cancelById, getCurrent, midtransManualUpdateStatus, midtransNotification, withdrawBalance, getAllSales, refundTransactionItem, imburseTransactionItem } from '../controllers/transaction'
import { insert as insertValidator, getById as getByIdValidator, cancelById as cancelByIdValidator, getCurrent as getCurrentValidator, midtransManualUpdateStatus as midtransManualUpdateStatusValidator, midtransNotification as midtransNotificationValidator, withdrawBalance as withdrawBalanceValidator, getAllSales as getAllSalesValidator, refundTransactionItem as refundTransactionItemValidator, imburseTransactionItem as imburseTransactionItemValidator } from '../validators/transaction'

export const router = Router()

const routes: Spec[] = [
  {
    method: "POST",
    path: "/",
    validate: insertValidator.validate,
    handler: [jwt, insert]
  },
  {
    method: "GET",
    path: "/",
    validate: getCurrentValidator.validate,
    handler: [jwt, getCurrent]
  },
  {
    method: "GET",
    path: "/sale",
    validate: getAllSalesValidator.validate,
    handler: [jwt, getAllSales]
  },
  {
    method: "GET",
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, isAdmin, getById]
  },
  {
    method: "POST",
    path: "/:id/cancel",
    validate: cancelByIdValidator.validate,
    handler: [jwt, cancelById]
  },
  {
    method: "POST",
    path: "/sale/:id/refund",
    validate: refundTransactionItemValidator.validate,
    handler: [jwt, isAdmin, refundTransactionItem]
  },
  {
    method: "POST",
    path: "/sale/:id/imburse",
    validate: imburseTransactionItemValidator.validate,
    handler: [jwt, isAdmin, imburseTransactionItem]
  },
  {
    method: "GET",
    path: "/:id/midtrans-manual-update-status",
    validate: midtransManualUpdateStatusValidator.validate,
    handler: [jwt, midtransManualUpdateStatus]
  },
  {
    method: "POST",
    path: "/withdraw-balance",
    validate: withdrawBalanceValidator.validate,
    handler: [jwt, withdrawBalance]
  },
  {
    method: "POST",
    path: "/midtrans-notification",
    validate: midtransNotificationValidator.validate,
    handler: [midtransNotification]
  },
]

router.route(routes)