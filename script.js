// ১. আপনার ফায়ারবেস কনফিগারেশন (আপনার আসল কোডটি এখানে বসিয়ে দেওয়া হয়েছে)
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

// ২. টেলিগ্রাম মিনি অ্যাপ SDK থেকে ইউনিক ইউজার আইডি নেওয়া
const tg = window.Telegram?.WebApp;
tg?.ready();
tg?.expand();

// যদি টেলিগ্রাম আইডি না পাওয়া যায় (যেমন ব্রাউজারে টেস্ট করার সময়), তবে একটি ডামি আইডি ব্যবহার হবে
let userId = "guest_user_dev";
let userName = "Guest";

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    userId = tg.initDataUnsafe.user.id; // এই ইউনিক আইডিটি একজনের টাকা অন্য আইডিতে যাওয়া বন্ধ করবে
    userName = tg.initDataUnsafe.user.first_name || "User";
}

// ডেটাবেসে ওই নির্দিষ্ট ইউজারের নিজস্ব ফোল্ডার বা লোকেশন
const userRef = database.ref('users/' + userId);

// ৩. ডেটাবেস থেকে ইউজারের রিয়েল-টাইম ব্যালেন্স ও ডাটা লোড করা
userRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // যদি ইউজার আগে থেকেই ডেটাবেসে থাকে, তবে তার রিয়েল ব্যালেন্স দেখাবে
        document.getElementById('balance-amount').innerText = "৳ " + data.balance.toFixed(2);
        document.getElementById('referred-count').innerHTML = `<i class="fa-solid fa-users"></i> ` + (data.referred || 0);
        document.getElementById('pending-count').innerHTML = `<i class="fa-solid fa-clock"></i> ` + (data.pending || 0);
    } else {
        // যদি একদম নতুন ইউজার প্রথমবার অ্যাপ ওপেন করে, তবে তার ব্যালেন্স ৳ ০.০০ দিয়ে অ্যাকাউন্ট তৈরি হবে
        userRef.set({
            name: userName,
            balance: 0,
            referred: 0,
            pending: 0
        });
    }
});

// ৪. কাজের উপর ভিত্তি করে ১০ সেকেন্ড কাউন্টডাউন এবং শুধুমাত্র ওই আইডিতে টাকা অ্যাড করার ফাংশন
function startTask(buttonId, rewardAmount) {
    const btn = document.getElementById(buttonId);
    let timeLeft = 10; // ১০ সেকেন্ডের টাইমার
    
    // বাটন লক করে দেওয়া যাতে কেউ একই সাথে বারবার ক্লিক করতে না পারে
    btn.disabled = true;
    btn.style.opacity = "0.6";
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            btn.innerText = "সম্পন্ন";
            btn.style.background = "#00ffaa";
            btn.style.color = "#000";
            
            // ফায়ারবেসে শুধুমাত্র এই নির্দিষ্ট ইউজারের আইডিতে টাকা সিকিউরডভাবে যোগ হবে
            userRef.child('balance').transaction((currentBalance) => {
                return (currentBalance || 0) + rewardAmount;
            });
            
            // টেলিগ্রাম অ্যাপের ভেতরে সাকসেস মেসেজ পপআপ করা
            if (tg) {
                tg.showAlert(`অভিনন্দন! আপনি সফলভাবে কাজ শেষ করে ৳${rewardAmount} পেয়েছেন।`);
            } else {
                alert(`অভিনন্দন! আপনি সফলভাবে কাজ শেষ করে ৳${rewardAmount} পেয়েছেন।`);
            }
            
        } else {
            btn.innerText = `${timeLeft} সে. অপেক্ষা...`;
            timeLeft--;
        }
    }, 1000);
}
