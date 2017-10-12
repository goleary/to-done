// src/firebase.js
import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBE-3y814aGiWHewt19Ym70MztcME4nHhI",
    authDomain: "todone-808ef.firebaseapp.com",
    databaseURL: "https://todone-808ef.firebaseio.com",
    projectId: "todone-808ef",
    storageBucket: "todone-808ef.appspot.com",
    messagingSenderId: "972253795543"
  };
firebase.initializeApp(config);
export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;