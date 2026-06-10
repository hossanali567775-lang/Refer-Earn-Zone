// টেলিগ্রাম আইডি অনুযায়ী ব্যালেন্স সেটআপ
const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe?.user?.id || 'guest';
const balanceKey = 'balance_' + userId;

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

updateUI();
