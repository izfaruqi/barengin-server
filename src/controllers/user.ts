import { ParameterizedContext } from "koa";

import { getConnection } from 'typeorm'
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { User } from "../entities/User";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const BCRYPT_ROUNDS = 13

export async function register(ctx: ParameterizedContext){
  const user: QueryDeepPartialEntity<User> = {
    email: ctx.request.body.email,
    password: await bcrypt.hash(ctx.request.body.password, BCRYPT_ROUNDS),
    isAdmin: ctx.request.body.isAdmin || false
  }
  try {
    const res = await getConnection().getRepository(User).insert(user)
    ctx.body = { id: res.identifiers[0].id }
  } catch (e: any){
    switch(e.code){
      case "ER_DUP_ENTRY":
        ctx.throw(403, e)
      default:
        ctx.throw(500, e)
    }
  }
}

export async function login(ctx: ParameterizedContext){
  const userFromDB = await getConnection().getRepository(User).findOne({ select: ["id", "password", "isAdmin"], where: { email: ctx.request.body.email }})
  if(userFromDB == null){
    ctx.throw(404, "User not found.")
  }
  if(await bcrypt.compare(ctx.request.body.password, userFromDB.password)){
    ctx.body = { token: await jwt.sign({ id: userFromDB.id, isAdmin: userFromDB.isAdmin, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + (60*60*24) }, process.env.JWT_SECRET!)}
  } else {
    ctx.throw(401, "Email/password incorrect")
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
  ctx.body = await getConnection().getRepository(User).find({ where: { id: parseInt(ctx.params.id) }})
}