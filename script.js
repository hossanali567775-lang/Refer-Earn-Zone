// টেলিগ্রাম থেকে ইউজার আইডি ধরা
const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe?.user?.id || 'guest_' + Math.floor(Math.random() * 1000);
const balanceKey = 'balance_' + userId; // শুধু এই ইউজারের জন্য আলাদা ব্যালেন্স কী

let userBalance = parseFloat(localStorage.getItem(balanceKey)) || 0.00;

function updateUI() {
    document.getElementById('userBalance').innerText = userBalance.toFixed(2);
}

function earn(amount) {
    userBalance += amount;
    localStorage.setItem(balanceKey, userBalance);
    updateUI();
    alert("আপনার ব্যালেন্সে " + amount + " টাকা যোগ হয়েছে!");
}

function completeTask(reward) {
    earn(reward);
}

updateUI();
