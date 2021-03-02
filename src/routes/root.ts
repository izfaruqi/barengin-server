import Router from 'koa-joi-router'
import { getConnection } from 'typeorm'
import { APP_VERSION } from '../index'

export const router = Router()

router.get("/", async ctx => {
  ctx.body = { version: APP_VERSION }
})

router.get("/UNSAFEclearAllData", async ctx => {
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
      const repository = await getConnection().getRepository(entity.name);
      await repository.clear();
  }
  ctx.body = { success: true }
})