import dotenv from 'dotenv'
import 'reflect-metadata'
import initDB from './db'
import initServer from './server'

export const APP_VERSION = "0.1.0"
dotenv.config()
initDB().then(_ => initServer())