import { createConnection } from 'typeorm'
import { BalanceMutation } from './entities/BalanceMutation'
import { DiscussionMessage } from './entities/DiscussionMessage'
import { DiscussionRoom } from './entities/DiscussionRoom'
import { Group } from './entities/Group'
import { GroupCategory } from './entities/GroupCategory'
import { GroupCredential } from './entities/GroupCredential'
import { GroupMembership } from './entities/GroupMembership'
import { Review } from './entities/Review'
import { Transaction } from './entities/Transaction'
import { TransactionItem } from './entities/TransactionItem'
import { User } from './entities/User'

export default async function initDB() {
  await createConnection({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT? parseInt(process.env.DB_PORT) : 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    "entities": [
      User,
      GroupCategory,
      Group,
      Transaction,
      TransactionItem,
      Review,
      BalanceMutation,
      DiscussionMessage,
      DiscussionRoom,
      GroupMembership,
      GroupCredential
    ]
  })
}