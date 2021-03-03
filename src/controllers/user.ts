import { ParameterizedContext } from "koa";

import { getConnection } from 'typeorm'
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { forbidden, notFound, unauthorized } from "@hapi/boom";

const BCRYPT_ROUNDS = 13

export async function register(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    ...ctx.request.body,
    password: await bcrypt.hash(ctx.request.body.password, BCRYPT_ROUNDS)
  }
  try {
    const res = await getConnection().getRepository(User).insert(user)
    ctx.body = { id: res.identifiers[0].id }
  } catch (e){
    switch(e.code){
      case "ER_DUP_ENTRY":
        throw forbidden("Email already exists.")
      default:
        throw e
    }
  }
}

export async function login(ctx: ParameterizedContext){
  const userFromDB = await getConnection().getRepository(User).findOne({ select: ["id", "password", "isAdmin"], where: { email: ctx.request.body.email }})
  if(userFromDB == null){
    throw unauthorized("Email/password incorrect.")
  }
  if(await bcrypt.compare(ctx.request.body.password, userFromDB.password)){
    ctx.body = { token: await jwt.sign({ id: userFromDB.id, isAdmin: userFromDB.isAdmin, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + (60*60*24) }, process.env.JWT_SECRET!)}
  } else {
    throw unauthorized("Email/password incorrect.")
  }
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
  if(ctx.request.body.password != null){
    user.password = await bcrypt.hash(ctx.request.body.password, BCRYPT_ROUNDS)
    ctx.request.body.password = null
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