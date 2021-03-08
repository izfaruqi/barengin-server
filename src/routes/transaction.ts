import jwt from '../middlewares/jwt'
import Router, { Spec } from 'koa-joi-router'
import isAdmin from '../middlewares/isAdmin'
import { insert, getById, cancelById, getCurrent, midtransManualUpdateStatus } from '../controllers/transaction'
import { insert as insertValidator, getById as getByIdValidator, cancelById as cancelByIdValidator, getCurrent as getCurrentValidator, midtransManualUpdateStatus as midtransManualUpdateStatusValidator } from '../validators/transaction'

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
    path: "/:id",
    validate: getByIdValidator.validate,
    handler: [jwt, isAdmin, getById]
  },
  {
    method: "GET",
    path: "/:id/cancel",
    validate: cancelByIdValidator.validate,
    handler: [jwt, cancelById]
  },
  {
    method: "GET",
    path: "/:id/midtrans-manual-update-status",
    validate: midtransManualUpdateStatusValidator.validate,
    handler: [jwt, midtransManualUpdateStatus]
  },
]

router.route(routes)