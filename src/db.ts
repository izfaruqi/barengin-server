import { createConnection } from 'typeorm'
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
      User
    ]
  })
}