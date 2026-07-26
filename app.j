<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB1xGcKVI4Ty23cVDY8CHYRi6AEk-Sxj3U",
    authDomain: "sorra-works.firebaseapp.com",
    projectId: "sorra-works",
    storageBucket: "sorra-works.firebasestorage.app",
    messagingSenderId: "646064583120",
    appId: "1:646064583120:web:7d3f8728f9476f800849d5",
    measurementId: "G-JRBM2MQR9C"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
