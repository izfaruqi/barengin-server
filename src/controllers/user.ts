import { ParameterizedContext } from "koa";

import { getConnection } from 'typeorm'
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

import jwt from 'jsonwebtoken'
import { forbidden, notFound, unauthorized } from "@hapi/boom";
import firebase from "firebase";
import admin from 'firebase-admin'
import crypto from 'crypto'

const MAX_REFERRALS = 1

export async function register(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    ...ctx.request.body
  }
  try {
    let referrer = null
    if(ctx.request.body.referralCode){
      referrer = await getConnection().getRepository(User).findOne({ where: { referralCode: ctx.request.body.referralCode }, loadRelationIds: true })
      if(referrer == null) throw notFound("Referral code not found.")
      if(referrer.referredUsers.length >= MAX_REFERRALS) throw forbidden("Referring user has reached it's maximum referree amount.") // TODO: This part is subject to race conditions.
      user.referredBy = referrer
    }
    user.referralCode = await crypto.randomBytes(10).toString("hex")
    const creds = await firebase.auth().createUserWithEmailAndPassword(ctx.request.body.email, ctx.request.body.password)
    user.firebaseUid = creds.user?.uid
    
    const res = await getConnection().getRepository(User).insert(user)
    if(referrer) await getConnection().getRepository(User).createQueryBuilder().relation("referredUsers").of(referrer).add(user)
    ctx.body = { id: res.identifiers[0].id }
  } catch (e){
    switch(e.code){
      case "ER_DUP_ENTRY":
      case "auth/email-already-in-use":
        throw forbidden("Email already exists.")
      default:
        throw e
    }
  }
}

export async function login(ctx: ParameterizedContext){
  let creds
  try {
    creds = await firebase.auth().signInWithEmailAndPassword(ctx.request.body.email, ctx.request.body.password)
  } catch (err) {
    console.log(err)
    throw unauthorized(err.message)
  }
  ctx.body = await generateToken(creds.user?.uid!)
}

export async function tokenSwap(ctx: ParameterizedContext){
  try {
    const decodedFirebaseToken = await admin.auth().verifyIdToken(ctx.request.body.firebaseIdToken)
    let token = await generateToken(decodedFirebaseToken.uid)
    if(token == null){ // User doesn't exist on DB, need to register first.
      const user: QueryDeepPartialEntity<User> = {
        email: decodedFirebaseToken.email,
        firstName: ctx.request.body.profile.given_name,
        lastName: ctx.request.body.profile.family_name,
        firebaseUid: decodedFirebaseToken.uid
      }
      const res = await getConnection().getRepository(User).insert(user)
      token = await generateToken(decodedFirebaseToken.uid)
      ctx.body = { ...token, id: res.identifiers[0].id }
      return
    }
    ctx.body = token
  } catch (err) {
    throw unauthorized(err.message)
  }
}

async function generateToken(firebaseUid: string): Promise<object | null> {
  const userFromDB = (await getConnection().getRepository(User).findOne({ select: ["id", "isAdmin", "isSeller"], where: { firebaseUid: firebaseUid }}))!
  if(userFromDB == null){
    return null
  }
  return { token: await jwt.sign({ id: userFromDB.id, isAdmin: userFromDB.isAdmin, isSeller: userFromDB.isSeller, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + (60*60*24) }, process.env.JWT_SECRET!)}
}

export async function getCurrent(ctx: ParameterizedContext) {
  const userFromDB = await getConnection().getRepository(User).createQueryBuilder("user")
    .where("user.id = :id", { id: ctx.state.user.id })
    .leftJoin("user.referredBy", "referredBy")
    .leftJoin("user.referredUsers", "referredUsers")
    .addSelect("referredBy.id").addSelect("referredBy.firstName").addSelect("referredBy.lastName")
    .addSelect("referredUsers.id").addSelect("referredUsers.firstName").addSelect("referredUsers.lastName")
    .getOne()
  ctx.body = userFromDB
}

export async function getAll(ctx: ParameterizedContext) {
  const usersFromDB = await getConnection().getRepository(User).find()
  ctx.body = usersFromDB
}

export async function getById(ctx: ParameterizedContext) {
  const userFromDB = await getConnection().getRepository(User).createQueryBuilder("user")
    .where("user.id = :id", { id: ctx.request.params.id })
    .leftJoin("user.referredBy", "referredBy")
    .leftJoin("user.referredUsers", "referredUsers")
    .addSelect("referredBy.id").addSelect("referredBy.firstName").addSelect("referredBy.lastName")
    .addSelect("referredUsers.id").addSelect("referredUsers.firstName").addSelect("referredUsers.lastName")
    .getOne()
  if(userFromDB == null) throw notFound("User not found.")
  ctx.body = userFromDB
}

export async function editById(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    ...ctx.request.body
  }
  try {
    const res = await getConnection().getRepository(User).update(ctx.request.params.id, user)
    if(res.raw.affectedRows == null || res.raw.affectedRows == 0){ // User ID not found
      throw notFound("User ID not found.")
    }
    ctx.body = { ...ctx.request.body }
  } catch (e){
    switch(e.code){
      default:
        throw e
    }
  }
}

export async function editCurrent(ctx: ParameterizedContext){
  ctx.params.id = ctx.state.user.id
  await editById(ctx)
}

export async function deleteById(ctx: ParameterizedContext) {
  const res = await getConnection().getRepository(User).softDelete(ctx.params.id)
  if(res.raw.affectedRows == null || res.raw.affectedRows == 0){ // User ID not found
    throw notFound("User ID not found.")
  } else {
    ctx.body = { success: true }
  }
}