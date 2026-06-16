// ১. ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyA0iU2q_AVn78ICFMjbISJKXhZYkuph4Cw",
  authDomain: "refer-earn-zone.firebaseapp.com",
  databaseURL: "https://refer-earn-zone-default-rtdb.firebaseio.com",
  projectId: "refer-earn-zone",
  storageBucket: "refer-earn-zone.firebasestorage.app",
  messagingSenderId: "1035860948377",
  appId: "1:1035860948377:web:5fc19e6fcc844cec6e4f08",
  measurementId: "G-WWCVYZQY9P"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ২. টেলিগ্রাম SDK ও ইউজার সেটআপ
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

let userId = tg?.initDataUnsafe?.user?.id || "guest_123";
let userName = tg?.initDataUnsafe?.user?.first_name || "Guest";
const userRef = database.ref('users/' + userId);

// ৩. ডাটা লোডিং
userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('balance-amount').innerText = "৳ " + (data.balance || 0).toFixed(2);
        document.getElementById('profile-name').innerText = data.name || userName;
        document.getElementById('profile-id').innerText = "ID: " + userId;
        
        // রেফারেল লিস্ট লোড
        loadReferralList();
        // উইথড্র হিস্টোরি লোড
        loadWithdrawHistory();
    } else {
        userRef.set({ name: userName, balance: 0, referred: 0 });
    }
});

// ৪. ট্যাব সুইচিং
function switchTab(buttonIndex, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-button')[buttonIndex].classList.add('active');
}

// ৫. টাস্ক লজিক
function startTask(id, reward, url) {
    tg ? tg.openLink(url) : window.open(url, '_blank');
    setTimeout(() => {
        userRef.child('balance').transaction(b => (b || 0) + reward);
        alert("টাস্ক সফল! আপনি " + reward + " টাকা পেয়েছেন।");
    }, 10000);
}

// ৬. রেফারেল ও উইথড্র লজিক
function copyReferLink() {
    const link = `https://t.me/ReferEarnZone23_bot?start=${userId}`;
    navigator.clipboard.writeText(link);
    alert("রেফার লিংক কপি হয়েছে!");
}

function requestWithdraw() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    userRef.once('value', (snap) => {
        const data = snap.val();
        if ((data.referred || 0) < 10) {
            alert("উত্তোলনের জন্য ১০টি রেফার প্রয়োজন!");
        } else if (amount < 600) {
            alert("নূন্যতম উত্তোলনের পরিমাণ ৬০০ টাকা!");
        } else {
            userRef.child('balance').transaction(b => (b || 0) - amount);
            database.ref('withdrawals').push({ userId, amount, status: 'Pending', time: new Date().toLocaleString() });
            alert("উত্তোলনের অনুরোধ সফল হয়েছে!");
        }
    });
}

// ৭. হিস্টোরি লোডার
function loadReferralList() {
    database.ref('users/' + userId + '/referred_users').on('value', (snap) => {
        const list = document.getElementById('referral-history-list');
        list.innerHTML = "";
        snap.forEach(child => list.innerHTML += `<div>${child.val().name} - জয়েন করেছে</div>`);
    });
}

function loadWithdrawHistory() {
    database.ref('withdrawals').orderByChild('userId').equalTo(userId).on('value', (snap) => {
        const list = document.getElementById('withdraw-history-list');
        list.innerHTML = "";
        snap.forEach(child => list.innerHTML += `<div>৳${child.val().amount} - ${child.val().status}</div>`);
    });
}
