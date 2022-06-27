import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyBc6Y1MjzLesyJ5cn9XYBjmmeTX5AhjAQE",
  authDomain: "mltestpipeline.firebaseapp.com",
  databaseURL: "https://mltestpipeline-default-rtdb.firebaseio.com",
  projectId: "mltestpipeline",
  storageBucket: "mltestpipeline.appspot.com",
  messagingSenderId: "771001387927",
  appId: "1:771001387927:web:91eadbe1037d0a221692d2"
};

firebase.initializeApp(firebaseConfig)