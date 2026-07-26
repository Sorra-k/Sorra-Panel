// Paste your Firebase Config configuration here
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Switch Tab function
function switchTab(tab) {
    if(tab === 'manga') {
        document.getElementById('manga-section').classList.remove('hidden');
        document.getElementById('illustration-section').classList.add('hidden');
    } else {
        document.getElementById('manga-section').classList.add('hidden');
        document.getElementById('illustration-section').classList.remove('hidden');
    }
}

function toggleAdminPanel() {
    document.getElementById('admin-panel').classList.toggle('hidden');
}

// Admin Login Handler
function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            alert("Admin logged in successfully!");
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('upload-form').classList.remove('hidden');
        })
        .catch(err => alert("Login Error: " + err.message));
}

function logoutAdmin() {
    auth.signOut().then(() => {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('upload-form').classList.add('hidden');
    });
}

// Check Authentication state
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('upload-form').classList.remove('hidden');
    }
});

// Create New Post (Admin Only)
function createPost() {
    const type = document.getElementById('post-type').value;
    const title = document.getElementById('post-title').value;
    const desc = document.getElementById('post-desc').value;
    const imageUrl = document.getElementById('post-image-url').value;

    if(!title || !imageUrl) return alert("Please fill in Title and Image URL!");

    db.collection("posts").add({
        type: type,
        title: title,
        desc: desc,
        imageUrl: imageUrl,
        likes: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Post published successfully!");
        document.getElementById('post-title').value = '';
        document.getElementById('post-desc').value = '';
        document.getElementById('post-image-url').value = '';
    });
}

// Load Posts Data
db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const mangaContainer = document.getElementById('manga-container');
    const illustrationContainer = document.getElementById('illustration-container');
    
    mangaContainer.innerHTML = '';
    illustrationContainer.innerHTML = '';

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        const id = doc.id;

        if(!data.createdAt) return;

        if (data.type === 'manga') {
            mangaContainer.innerHTML += `
                <div class="manga-card">
                    <img src="${data.imageUrl}" alt="${data.title}">
                    <h3>${data.title}</h3>
                    <p>${data.desc}</p>
                    <div class="interaction-bar">
                        <button class="like-btn" onclick="toggleLike('${id}', ${data.likes})">
                            ❤️ <span id="like-count-${id}">${data.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;
        } else {
            illustrationContainer.innerHTML += `
                <div class="illustration-card">
                    <img src="${data.imageUrl}" alt="${data.title}">
                    <h3>${data.title}</h3>
                    <p>${data.desc}</p>
                    <div class="interaction-bar">
                        <button class="like-btn" onclick="toggleLike('${id}', ${data.likes})">
                            ❤️ <span id="like-count-${id}">${data.likes || 0}</span>
                        </button>
                    </div>
                </div>
            `;
        }
    });
});

// Like and Unlike Toggle
function toggleLike(postId, currentLikes) {
    const hasLiked = localStorage.getItem(`liked_${postId}`);
    const postRef = db.collection("posts").doc(postId);

    if (hasLiked) {
        postRef.update({ likes: firebase.firestore.FieldValue.increment(-1) });
        localStorage.removeItem(`liked_${postId}`);
    } else {
        postRef.update({ likes: firebase.firestore.FieldValue.increment(1) });
        localStorage.setItem(`liked_${postId}`, 'true');
    }
}
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
