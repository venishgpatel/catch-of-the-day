import firebase from "firebase/app";
import 'firebase/database';
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_XdkFV840JHmTcpRIEDxizxff1lENjeg",
  authDomain: "catch-of-the-day-venish.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-venish.firebaseio.com",
  projectId: "catch-of-the-day-venish",
  storageBucket: "catch-of-the-day-venish.appspot.com",
  messagingSenderId: "427521997084",
  appId: "1:427521997084:web:8745b446746c15e137e2d9",
  measurementId: "G-DN3LTCE95C"
};

firebase.initializeApp(firebaseConfig);

export default firebase;