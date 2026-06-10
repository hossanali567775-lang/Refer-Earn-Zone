// টেলিগ্রাম ইউজার আইডি পাওয়ার জন্য
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId') || 'default_user';

// ব্যালেন্স লোড করা
let balance = localStorage.getItem('balance_' + userId) || 0;
document.getElementById('balance').innerText = balance;

// টাকা যোগ করার ফাংশন
function earnMoney() {
    balance = parseInt(balance) + 10;
    localStorage.setItem('balance_' + userId, balance);
    document.getElementById('balance').innerText = balance;
    alert("১০ টাকা যোগ হয়েছে!");
}
