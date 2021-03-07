import firebase from 'firebase'
import admin from 'firebase-admin'
import path from 'path'

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export function initFirebase(){
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  })

  firebase.initializeApp(require(path.join("..", process.env.GOOGLE_FIREBASE_CONFIG!)))
}