// Thay cấu hình Firebase của bạn vào đây
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Chuyển Tab Manga / Pinterest
function switchTab(tab) {
    if(tab === 'manga') {
        document.getElementById('manga-section').classList.remove('hidden');
        document.getElementById('pinterest-section').classList.add('hidden');
    } else {
        document.getElementById('manga-section').classList.add('hidden');
        document.getElementById('pinterest-section').classList.remove('hidden');
    }
}

function toggleAdminPanel() {
    document.getElementById('admin-panel').classList.toggle('hidden');
}

// Xử lý Đăng nhập Admin
function loginAdmin() {
    const email = document.getElementById('admin-email').value;
    const pass = document.getElementById('admin-pass').value;

    auth.signInWithEmailAndPassword(email, pass)
        .then(() => {
            alert("Đăng nhập Admin thành công!");
            document.getElementById('login-form').classList.add('hidden');
            document.getElementById('upload-form').classList.remove('hidden');
        })
        .catch(err => alert("Lỗi đăng nhập: " + err.message));
}

function logoutAdmin() {
    auth.signOut().then(() => {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('upload-form').classList.add('hidden');
    });
}

// Kiểm tra trạng thái đăng nhập
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('upload-form').classList.remove('hidden');
    }
});

// Đăng bài mới (Chỉ Admin)
function createPost() {
    const type = document.getElementById('post-type').value;
    const title = document.getElementById('post-title').value;
    const desc = document.getElementById('post-desc').value;
    const imageUrl = document.getElementById('post-image-url').value;

    if(!title || !imageUrl) return alert("Vui lòng điền đủ Tiêu đề và Link ảnh!");

    db.collection("posts").add({
        type: type,
        title: title,
        desc: desc,
        imageUrl: imageUrl,
        likes: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Đăng bài thành công!");
        document.getElementById('post-title').value = '';
        document.getElementById('post-desc').value = '';
        document.getElementById('post-image-url').value = '';
    });
}

// Tải dữ liệu bài viết
db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
    const mangaContainer = document.getElementById('manga-container');
    const pinContainer = document.getElementById('pinterest-container');
    
    mangaContainer.innerHTML = '';
    pinContainer.innerHTML = '';

    snapshot.docs.forEach(doc => {
        const data = doc.data();
        const id = doc.id;

        // Bỏ qua nếu dữ liệu chưa tạo xong timestamp
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
            pinContainer.innerHTML += `
                <div class="pin-card">
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

// Xử lý Thả tim và Hoàn tác (Unlike)
function toggleLike(postId, currentLikes) {
    const hasLiked = localStorage.getItem(`liked_${postId}`);
    const postRef = db.collection("posts").doc(postId);

    if (hasLiked) {
        // Nếu đã thả tim -> Bỏ tim (Trừ 1)
        postRef.update({ likes: firebase.firestore.FieldValue.increment(-1) });
        localStorage.removeItem(`liked_${postId}`);
    } else {
        // Nếu chưa thả tim -> Thả tim (Cộng 1)
        postRef.update({ likes: firebase.firestore.FieldValue.increment(1) });
        localStorage.setItem(`liked_${postId}`, 'true');
    }
}
