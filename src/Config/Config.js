// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2eqLi-U_RAFNEfwxXy29fsBTIKepNTWM",
  authDomain: "abol-books.firebaseapp.com",
  projectId: "abol-books",
  storageBucket: "abol-books.appspot.com",
  messagingSenderId: "716384829844",
  appId: "1:716384829844:web:fc479c24241ee478aa0f81",
  measurementId: "G-HMLV746HNQ",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export { auth, fs, storage };
