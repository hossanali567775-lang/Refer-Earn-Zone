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
        
        // হোম পেজ আপডেট
        document.getElementById('balance-amount').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('referred-count').innerText = currentGlobalRefers;
        document.getElementById('pending-count').innerText = data.pending || 0;
        
        // প্রোফাইল পেজ আপডেট
        document.getElementById('profile-name').innerText = data.name || userName;
        document.getElementById('profile-id').innerText = "ID: " + userId;
        document.getElementById('profile-balance').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('profile-refers').innerText = currentGlobalRefers;
    } else {
        userRef.set({
            name: userName,
            balance: 0,
            referred: 0,
            pending: 0
        });
    }
});

// ৪. রিয়াল-টাইম উইথড্র হিস্টোরি লিসেনার
database.ref('user_withdrawals/' + userId).on('value', (snapshot) => {
    const historyContainer = document.getElementById('withdraw-history-list');
    if(!historyContainer) return;
    historyContainer.innerHTML = ""; 
    
    const data = snapshot.val();
    if (data) {
        const keys = Object.keys(data).reverse();
        keys.forEach(key => {
            const item = data[key];
            let statusClass = "status-pending";
            let statusText = "পেন্ডিং";
            
            if(item.status === "Approved" || item.status === "Success") {
                statusClass = "status-approved";
                statusText = "সফল";
            } else if(item.status === "Rejected") {
                statusClass = "status-rejected";
                statusText = "বাতিল";
            }
            
            historyContainer.innerHTML += `
                <div class="history-item">
                    <div class="history-left">
                        <h5>${item.method} (${item.number})</h5>
                        <span>${item.time}</span>
                    </div>
                    <div class="history-right">
                        <div class="history-amount">৳${item.amount}</div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        });
    } else {
        historyContainer.innerHTML = `<p style="font-size: 11px; color: #7683be; text-align: center; padding: 15px;">কোনো হিস্টোরি পাওয়া যায়নি</p>`;
    }
});

// সঠিক বটের ইউজারনেম এখানে সেট করা হয়েছে
const BOT_USERNAME = "ReferEarnZone23_bot"; 
const linkInput = document.getElementById('refer-link-input');
if(linkInput) {
    linkInput.value = `https://t.me/${BOT_USERNAME}?start=${userId}`;
}

// ৫. পেজ বা ট্যাব পরিবর্তন ফাংশন
function switchTab(buttonIndex, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    buttons[buttonIndex].classList.add('active');
}

// ৬. রেফার লিংক কপি ফাংশন
function copyReferLink() {
    const copyText = document.getElementById('refer-link-input');
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    
    if (tg) tg.showAlert("আপনার রেফার লিংকটি কপি হয়েছে!");
    else alert("আপনার রেফার লিংকটি কপি হয়েছে!");
}

// ৭. নতুন উইথড্র লজিক
function requestWithdraw() {
    const method = document.getElementById('withdraw-method').value;
    const number = document.getElementById('withdraw-number').value;
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (!number || isNaN(amount) || amount < 700) {
        const errorMsg = "দয়া করে সঠিক নাম্বার দিন এবং নূন্যতম ৳৭০০ উত্তোলন করার চেষ্টা করুন।";
        if(tg) tg.showAlert(errorMsg); else alert(errorMsg);
        return;
    }

    if (currentGlobalRefers < 10) {
        const referAlert = `টাকা তুলতে কমপক্ষে ১০টি রেফার প্রয়োজন। আপনার বর্তমান রেফার: ${currentGlobalRefers}টি।`;
        if(tg) tg.showAlert(referAlert); else alert(referAlert);
        return;
    }
    
    if (currentGlobalBalance >= amount) {
        userRef.child('balance').transaction((currentBalance) => (currentBalance || 0) - amount);
        
        const withdrawData = {
            method: method,
            number: number,
            amount: amount,
            status: "Pending",
            time: new Date().toLocaleString()
        };

        database.ref('user_withdrawals/' + userId).push(withdrawData);
        database.ref('admin_withdrawals').push({ userId: userId, name: userName, ...withdrawData });
        
        document.getElementById('withdraw-number').value = "";
        document.getElementById('withdraw-amount').value = "";
        
        if(tg) tg.showAlert(`আপনার ৳${amount} উত্তোলনের অনুরোধটি সফল হয়েছে!`);
        else alert(`আপনার ৳${amount} উত্তোলনের অনুরোধটি সফল হয়েছে!`);
    } else {
        if(tg) tg.showAlert("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
        else alert("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
    }
}

// ৮. লিংক ওপেনিং এবং টাস্ক কাউন্টডাউন
function startTask(buttonId, rewardAmount, targetUrl) {
    if (tg) {
        if (targetUrl.includes("t.me")) tg.openTelegramLink(targetUrl);
        else tg.openLink(targetUrl);
    } else {
        window.open(targetUrl, '_blank');
    }

    const btn = document.getElementById(buttonId);
    let timeLeft = 10;
    btn.disabled = true;
    btn.style.opacity = "0.6";
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.innerText = "সম্পন্ন";
            btn.style.background = "#00ffaa";
            btn.style.color = "#000";
            userRef.child('balance').transaction((currentBalance) => (currentBalance || 0) + rewardAmount);
        } else {
            btn.innerText = `${timeLeft} সে. অপেক্ষা...`;
            timeLeft--;
        }
    }, 1000);
}
