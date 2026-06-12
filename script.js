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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ২. টেলিগ্রাম মিনি অ্যাপ SDK সেটআপ
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

let userId = "guest_dev_id";
let userName = "Guest User";

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    userId = tg.initDataUnsafe.user.id;
    userName = tg.initDataUnsafe.user.first_name || "User";
}

const userRef = database.ref('users/' + userId);
let currentGlobalBalance = 0; 
let currentGlobalRefers = 0; 

// ৩. রিয়াল-টাইম ইউজার ডাটা লিসেনার
userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentGlobalBalance = data.balance || 0;
        currentGlobalRefers = data.referred || 0;
        
        document.getElementById('balance-amount').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('referred-count').innerText = currentGlobalRefers;
        document.getElementById('pending-count').innerText = data.pending || 0;
        
        document.getElementById('profile-name').innerText = data.name || userName;
        document.getElementById('profile-id').innerText = "ID: " + userId;
        document.getElementById('profile-balance').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('profile-refers').innerText = currentGlobalRefers;
    } else {
        userRef.set({ name: userName, balance: 0, referred: 0, pending: 0 });
    }
});

// ৪. রেফারেল লিস্ট লোড করার ফাংশন
function loadReferralList() {
    const referListContainer = document.getElementById('referral-history-list');
    if(!referListContainer) return;
    
    database.ref('users/' + userId + '/referred_users').on('value', (snapshot) => {
        referListContainer.innerHTML = ""; 
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(user => {
                referListContainer.innerHTML += `
                    <div class="history-item" style="display: flex; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.05); margin-bottom: 8px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
                        <h5 style="margin:0; font-size: 13px;">${user.name}</h5>
                        <span style="color: #00ffaa; font-size: 11px; font-weight: bold;">✓ রেফার সফল</span>
                    </div>
                `;
            });
        } else {
            referListContainer.innerHTML = `<p style="font-size: 11px; color: #7683be; text-align: center; padding: 15px;">এখনও কাউকে রেফার করেননি</p>`;
        }
    });
}
loadReferralList();

// ৫. উইথড্র হিস্টোরি লিসেনার
database.ref('user_withdrawals/' + userId).on('value', (snapshot) => {
    const historyContainer = document.getElementById('withdraw-history-list');
    if(!historyContainer) return;
    historyContainer.innerHTML = ""; 
    const data = snapshot.val();
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const item = data[key];
            historyContainer.innerHTML += `
                <div class="history-item">
                    <div class="history-left"><h5>${item.method} (${item.number})</h5><span>${item.time}</span></div>
                    <div class="history-right"><div class="history-amount">৳${item.amount}</div><span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span></div>
                </div>
            `;
        });
    }
});

const BOT_USERNAME = "ReferEarnZone23_bot"; 
const linkInput = document.getElementById('refer-link-input');
if(linkInput) linkInput.value = `https://t.me/${BOT_USERNAME}?start=${userId}`;

function switchTab(buttonIndex, tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-button').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.nav-button')[buttonIndex].classList.add('active');
}

function copyReferLink() {
    const copyText = document.getElementById('refer-link-input');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    tg ? tg.showAlert("লিংক কপি হয়েছে!") : alert("লিংক কপি হয়েছে!");
}

function requestWithdraw() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    if (currentGlobalRefers < 10) { alert("১০টি রেফার প্রয়োজন!"); return; }
    if (currentGlobalBalance >= amount && amount >= 700) {
        userRef.child('balance').transaction(b => (b || 0) - amount);
        database.ref('user_withdrawals/' + userId).push({
            method: document.getElementById('withdraw-method').value,
            number: document.getElementById('withdraw-number').value,
            amount: amount,
            status: "Pending",
            time: new Date().toLocaleString()
        });
        alert("অনুরোধ সফল!");
    } else alert("ব্যালেন্স বা রেফার কম আছে!");
}

function startTask(buttonId, rewardAmount, targetUrl) {
    tg ? tg.openLink(targetUrl) : window.open(targetUrl, '_blank');
    const btn = document.getElementById(buttonId);
    btn.disabled = true;
    setTimeout(() => {
        btn.innerText = "সম্পন্ন";
        userRef.child('balance').transaction(b => (b || 0) + rewardAmount);
    }, 10000);
}
