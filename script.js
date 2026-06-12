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

// ফায়ারবেস ইনিশিয়ালাইজ করা
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ২. টেলিগ্রাম মিনি অ্যাপ SDK সেটআপ
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

let userId = "guest_user_dev";
let userName = "Guest";

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    userId = tg.initDataUnsafe.user.id;
    userName = tg.initDataUnsafe.user.first_name || "User";
}

const userRef = database.ref('users/' + userId);

// ৩. রিয়েল-টাইম ডাটা লোড ও রেফার বোনাস সেটিংস (৳১৫)
userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        document.getElementById('balance-amount').innerText = "৳ " + data.balance.toFixed(2);
        document.getElementById('referred-count').innerText = data.referred || 0;
        document.getElementById('pending-count').innerText = data.pending || 0;
    } else {
        // নতুন ইউজারের প্রোফাইল তৈরি এবং রেফার বোনাস ভ্যালু সেট করে রাখা
        userRef.set({
            name: userName,
            balance: 0,
            referred: 0,
            pending: 0,
            referralRewardAmount: 15 // আপনার চাহিদামতো রেফার বোনাস ১৫ টাকা সেট করা হলো
        });
    }
});

// ৪. লিংক ওপেনিং এবং ব্যালেন্স যোগ করার মূল ফাংশন
function startTask(buttonId, rewardAmount, targetUrl) {
    // প্রথমে ইউজারের জন্য টেলিগ্রাম অ্যাপের ভেতর বা ব্রাউজারে লিংকটি ওপেন করা হবে
    if (tg && tg.openLink) {
        tg.openLink(targetUrl);
    } else {
        window.open(targetUrl, '_blank');
    }

    const btn = document.getElementById(buttonId);
    let timeLeft = 10; // ১০ সেকেন্ড টাইমার
    
    // বাটন লক করা
    btn.disabled = true;
    btn.style.opacity = "0.6";
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.innerText = "সম্পন্ন";
            btn.style.background = "#00ffaa";
            btn.style.color = "#000";
            
            // ফায়ারবেসে টাকা নিরাপদে যোগ করা
            userRef.child('balance').transaction((currentBalance) => {
                return (currentBalance || 0) + rewardAmount;
            });
            
            // সাকসেস নোটিফিকেশন
            if (tg) {
                tg.showAlert(`অভিনন্দন! আপনি সফলভাবে কাজটি সম্পন্ন করে ৳${rewardAmount} পেয়েছেন।`);
            } else {
                alert(`অভিনন্দন! আপনি সফলভাবে কাজটি সম্পন্ন করে ৳${rewardAmount} পেয়েছেন।`);
            }
            
        } else {
            btn.innerText = `${timeLeft} সে. অপেক্ষা...`;
            timeLeft--;
        }
    }, 1000);
}
