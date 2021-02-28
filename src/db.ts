import { createConnection } from 'typeorm'
import './entities/User'
import { User } from './entities/User'

export default async function initDB() {
  await createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "barengin",
    password: "barengin2021",
    database: "barengin",
    synchronize: true,
    logging: false,
    "entities": [
      User
    ]
  })
}