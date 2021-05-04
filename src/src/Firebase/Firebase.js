import firebase from 'firebase'

<script src="https://www.gstatic.com/firebasejs/7.14.1/firebase-analytics.js"></script>

var firebaseConfig = {
  apiKey: "AIzaSyBr2EqAPcFVuonLXkKt2w-GROBoGNamVnA",
  authDomain: "project-management-system-oz.firebaseapp.com",
  projectId: "project-management-system-oz",
  storageBucket: "project-management-system-oz.appspot.com",
  messagingSenderId: "532103742701",
  appId: "1:532103742701:web:663c69b233f7a056d8b8e4",
  measurementId: "G-L35GCYEH1C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;