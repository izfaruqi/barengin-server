import dotenv from 'dotenv'
import 'reflect-metadata'
import initDB from './db'
import { initFirebase } from './firebase'
import initServer from './server'

export const APP_VERSION = "0.1.0"
dotenv.config()
initFirebase()
initDB().then(_ => initServer())