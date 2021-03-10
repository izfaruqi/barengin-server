import { ParameterizedContext } from "koa";
import { getConnection } from "typeorm";
import { BalanceMutation } from "../entities/BalanceMutation";

export async function getCurrent(ctx: ParameterizedContext){
  ctx.body = await getConnection().getRepository(BalanceMutation).find({ where: { owner: { id: ctx.state.user.id } } })
}