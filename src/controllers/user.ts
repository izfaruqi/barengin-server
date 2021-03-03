import { ParameterizedContext } from "koa";

import { getConnection } from 'typeorm'
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { forbidden, notFound, unauthorized } from "@hapi/boom";
import firebase from "firebase";
import admin, { firestore } from 'firebase-admin'

const BCRYPT_ROUNDS = 13

export async function register(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    ...ctx.request.body
  }
  try {
    const creds = await firebase.auth().createUserWithEmailAndPassword(ctx.request.body.email, ctx.request.body.password)
    user.firebaseUid = creds.user?.uid
    const res = await getConnection().getRepository(User).insert(user)
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
  const id = ctx.state.user.id
  const userFromDB = await getConnection().getRepository(User).findOne({ where: { id: id }})
  ctx.body = userFromDB
}

export async function getAll(ctx: ParameterizedContext) {
  const usersFromDB = await getConnection().getRepository(User).find()
  ctx.body = usersFromDB
}

export async function getById(ctx: ParameterizedContext) {
  ctx.body = await getConnection().getRepository(User).find({ where: { id: ctx.params.id }})
}

export async function editById(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    ...ctx.request.body
  }
  try {
    const res = await getConnection().getRepository(User).update(ctx.request.params.id, user)
    if(res.affected == null || res.affected == 0){ // User ID not found
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
  if(res.affected == null || res.affected == 0){ // User ID not found
    throw notFound("User ID not found.")
  } else {
    ctx.body = { success: true }
  }
}