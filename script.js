// ১. ফায়ারবেস কনফিগারেশন সেটআপ (আপনার অ্যাকাউন্ট লিংক করা হয়েছে)
const firebaseConfig = {
  apiKey: "AIzaSyA0iU2q_AVn78ICFMjbISJKXhZYkuph4Cw",
  authDomain: "refer-earn-zone.firebaseapp.com",
  databaseURL: "https://refer-earn-zone-default-rtdb.firebaseio.com",
  projectId: "refer-earn-zone",
  storageBucket: "refer-earn-zone.firebasestorage.app",
  messagingSenderId: "1035860948377",
  appId: "1:1035860948377:web:5fc19e6fcc844cec6e4f08",
  measurementId: "G-WWCYZQY9P"
};

// ফায়ারবেস চালু করা
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ২. টেলিগ্রাম ওয়েব অ্যাপ সেটআপ
let tg = window.Telegram.WebApp;
tg.expand(); // অ্যাপটি পুরো স্ক্রিনে ওপেন হবে

// ইউজারের ইউনিক আইডি নেওয়া (ব্রাউজারে টেস্ট করলে 'guest_user' দেখাবে)
let userId = tg.initDataUnsafe?.user?.id || 'guest_user';
let username = tg.initDataUnsafe?.user?.username || 'Unknown_User';

// শুরুর গ্লোবাল ব্যালেন্স
let balance = 0.00;

// ৩. ফায়ারবেস থেকে ইউজারের ব্যালেন্স চেক ও লোড করা
database.ref('users/' + userId).once('value').then((snapshot) => {
    if (snapshot.exists()) {
        // ইউজার আগে এসে থাকলে ডাটাবেস থেকে তার জমানো টাকা লোড হবে
        balance = parseFloat(snapshot.val().balance || 0);
    } else {
        // একদম নতুন ইউজার হলে ডাটাবেসে তার অ্যাকাউন্ট তৈরি হবে এবং শুরুতে ০.০০ টাকা থাকবে
        balance = 0.00;
        database.ref('users/' + userId).set({
            username: username,
            balance: balance
        });
    }
    // স্ক্রিনে ব্যালেন্স দেখানো
    document.getElementById('balance').innerText = '৳' + balance.toFixed(2);
}).catch((error) => {
    console.error("ডাটা লোড করতে সমস্যা হয়েছে: ", error);
});

// ৪. টাস্ক টাইমার এবং ব্যালেন্স অ্যাড করার ফাংশন
function startTask(btn, amount, link) {
    let timeLeft = 10; // ১০ সেকেন্ডের টাইমার
    btn.disabled = true;
    btn.innerText = timeLeft + "s";
    
    // নতুন ট্যাবে লিংক ওপেন হবে
    window.open(link, '_blank');

    // টাইমার কাউন্টডাউন শুরু
    let timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            btn.innerText = timeLeft + "s";
        } else {
            clearInterval(timer);
            
            // ব্যালেন্স যোগ করা
            balance += amount;
            
            // ফায়ারবেস ডেটাবেসে ইউজারের নিজস্ব আইডিতে লাইভ টাকা আপডেট
            database.ref('users/' + userId).update({
                balance: balance
            }).then(() => {
                // স্ক্রিনে নতুন ব্যালেন্স দেখানো
                document.getElementById('balance').innerText = '৳' + balance.toFixed(2);
                
                // বাটন সম্পন্ন করা
                btn.innerText = "সম্পন্ন";
                btn.style.backgroundColor = "#333";
                btn.style.color = "#888";
            }).catch((err) => {
                alert("টাকা সেভ হতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
                btn.disabled = false;
                btn.innerText = "বিজ্ঞাপন দেখুন";
            });
        }
    }, 1000);
}
