import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// THIS IS USED TO INITIALIZE THE firebase OBJECT
// PUT YOUR FIREBASE PROJECT CONFIG STUFF HERE
var firebaseConfig = {
    apiKey: "AIzaSyDBIkco23zvzGta97K5HAaSqDOKSaba1qg",
    authDomain: "secret-santa-website-f0d5b.firebaseapp.com",
    databaseURL: "https://secret-santa-website-f0d5b.firebaseio.com",
    projectId: "secret-santa-website-f0d5b",
    storageBucket: "secret-santa-website-f0d5b.appspot.com",
    messagingSenderId: "770618191062",
    appId: "1:770618191062:web:858fec00a4ac215dfa6d77",
    measurementId: "G-P5LSFHXE3K"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

// NOW THE firebase OBJECT CAN BE CONNECTED TO THE STORE
export default firebase;