// ১. ফায়ারবেস কনফিগারেশন (আপনার স্ক্রিনশট থেকে নেওয়া শতভাগ সঠিক কোড)
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

// ফায়ারবেস ইনিশিয়ালাইজ করা
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

// ৩. রিয়াল-টাইম ডেটাবেস লিসেনার (ডাটা অটো আপডেট হবে)
userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentGlobalBalance = data.balance || 0;
        
        // হোম পেজের ডাটা
        document.getElementById('balance-amount').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('referred-count').innerText = data.referred || 0;
        document.getElementById('pending-count').innerText = data.pending || 0;
        
        // প্রোফাইল পেজের ডাটা
        document.getElementById('profile-name').innerText = data.name || userName;
        document.getElementById('profile-id').innerText = "ID: " + userId;
        document.getElementById('profile-balance').innerText = "৳ " + currentGlobalBalance.toFixed(2);
        document.getElementById('profile-refers').innerText = data.referred || 0;
    } else {
        // নতুন ইউজারের জন্য ডেটাবেস প্রোফাইল তৈরি
        userRef.set({
            name: userName,
            balance: 0,
            referred: 0,
            pending: 0
        });
    }
});

// আপনার টেলিগ্রাম বটের ইউজারনেমটি "ReferEarnZoneBot" এর জায়গায় বসাতে পারেন
const BOT_USERNAME = "ReferEarnZoneBot"; 
document.getElementById('refer-link-input').value = `https://t.me/${BOT_USERNAME}?start=${userId}`;

// ৪. পেজ বা ট্যাব পরিবর্তনের ফাংশন
function switchTab(buttonIndex, tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    buttons[buttonIndex].classList.add('active');
}

// ৫. রেফার লিংক কপি ফাংশন
function copyReferLink() {
    const copyText = document.getElementById('refer-link-input');
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    
    if (tg) tg.showAlert("আপনার রেফার লিংকটি কপি হয়েছে!");
    else alert("আপনার রেফার লিংকটি কপি হয়েছে!");
}

// ৬. উইথড্র (টাকা উত্তোলন) ফাংশন
function requestWithdraw() {
    const method = document.getElementById('withdraw-method').value;
    const number = document.getElementById('withdraw-number').value;
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (!number || isNaN(amount) || amount < 100) {
        if(tg) tg.showAlert("দয়া করে সঠিক নাম্বার এবং নূন্যতম ৳১০০ পরিমাণ লিখুন।");
        else alert("দয়া করে সঠিক নাম্বার এবং নূন্যতম ৳১০০ পরিমাণ লিখুন।");
        return;
    }
    
    if (currentGlobalBalance >= amount) {
        // ইউজারের ব্যালেন্স থেকে টাকা মাইনাস করা
        userRef.child('balance').transaction((currentBalance) => {
            return (currentBalance || 0) - amount;
        });
        
        // অ্যাডমিন প্যানেলে (Database) রিকোয়েস্ট পাঠানো
        database.ref('withdrawals').push({
            userId: userId,
            name: userName,
            method: method,
            number: number,
            amount: amount,
            status: "Pending",
            time: new Date().toLocaleString()
        });
        
        document.getElementById('withdraw-number').value = "";
        document.getElementById('withdraw-amount').value = "";
        
        if(tg) tg.showAlert(`আপনার ৳${amount} উত্তোলনের অনুরোধটি সফল হয়েছে! ২৪ ঘণ্টার মধ্যে পেমেন্ট পেয়ে যাবেন।`);
        else alert(`আপনার ৳${amount} উত্তোলনের অনুরোধটি সফল হয়েছে!`);
    } else {
        if(tg) tg.showAlert("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
        else alert("আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!");
    }
}

// ৭. লিংক ওপেনিং এবং টাস্ক কাউন্টডাউন
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
            
            // ডেটাবেসে ব্যালেন্স যোগ করা
            userRef.child('balance').transaction((currentBalance) => {
                return (currentBalance || 0) + rewardAmount;
            });
            
            if (tg) tg.showAlert(`অভিনন্দন! আপনি সফলভাবে কাজটি সম্পন্ন করে ৳${rewardAmount} পেয়েছেন।`);
            else alert(`অভিনন্দন! আপনি সফলভাবে কাজটি সম্পন্ন করে ৳${rewardAmount} পেয়েছেন।`);
        } else {
            btn.innerText = `${timeLeft} সে. অপেক্ষা...`;
            timeLeft--;
        }
    }, 1000);
}
