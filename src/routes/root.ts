import Router from 'koa-joi-router'
import { getConnection } from 'typeorm'
import { Group } from '../entities/Group'
import { GroupCategory } from '../entities/GroupCategory'
import { User } from '../entities/User'
import { APP_VERSION } from '../index'

export const router = Router()

// TODO: Might need to clean this up later.
router.get("/", async ctx => {
  ctx.body = { version: APP_VERSION }
})

router.get("/landing-stats", async ctx => {
  ctx.body = {
    users: await getConnection().getRepository(User).count(),
    groups: await getConnection().getRepository(Group).count(),
    groupCategories: await getConnection().getRepository(GroupCategory).count(),
  }
})

router.get("/UNSAFEclearAllData", async ctx => {
  const entities = getConnection().entityMetadatas;

  for (const entity of entities) {
      const repository = await getConnection().getRepository(entity.name);
      await repository.clear();
  }

  ctx.body = { success: true, message: "Dont forget to delete all accounts from Firebase Auth!" }
})