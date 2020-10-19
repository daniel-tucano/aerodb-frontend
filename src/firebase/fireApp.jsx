import * as firebase from 'firebase/app'
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA4XJ2Wyb_MghY2DdYHk5yo3g2up78V5GM",
    authDomain: "aero-no-sql-dev.firebaseapp.com",
    databaseURL: "https://aero-no-sql-dev.firebaseio.com",
    projectId: "aero-no-sql-dev",
    storageBucket: "aero-no-sql-dev.appspot.com",
    messagingSenderId: "1000839063205",
    appId: "1:1000839063205:web:b9bf8d05a3cb554b610f4c",
    measurementId: "G-G0018TEX3P"
};

const fireApp = firebase.initializeApp(firebaseConfig)


export const db = fireApp.firestore();
export default fireApp
