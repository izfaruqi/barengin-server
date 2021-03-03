import firebase from 'firebase'
import admin from 'firebase-admin'

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export function initFirebase(){
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  })
  firebase.initializeApp({
    apiKey: "AIzaSyDZ1DdW0jFBbWrdkkKqdoY95NI0PvuFdi4",
    authDomain: "bareng-in.firebaseapp.com",
    projectId: "bareng-in",
    storageBucket: "bareng-in.appspot.com",
    messagingSenderId: "18568775224",
    appId: "1:18568775224:web:2e8bd23b6f230a5a8588cd",
    measurementId: "G-85YDMPMGEW"
  })
}