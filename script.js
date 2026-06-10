const tg = window.Telegram.WebApp;
const userId = tg.initDataUnsafe?.user?.id || 'guest';
const balanceKey = 'balance_' + userId;

let userBalance = parseFloat(localStorage.getItem(balanceKey)) || 0.00;

function updateUI() {
    document.getElementById('userBalance').innerText = userBalance.toFixed(2);
    
    // টিক চিহ্ন চেক
    if(localStorage.getItem('group_' + userId)) {
        document.getElementById('groupTask').innerHTML = "<span>📢 সাপোর্ট গ্রুপ (Done ✅)</span>";
    }
    if(localStorage.getItem('channel_' + userId)) {
        document.getElementById('channelTask').innerHTML = "<span>💬 পেমেন্ট চ্যানেল (Done ✅)</span>";
    }
}

function completeTask(type, reward) {
    if(localStorage.getItem(type + '_' + userId)) {
        alert("আপনি অলরেডি এটি করেছেন!");
        return;
    }
    
    userBalance += reward;
    localStorage.setItem(balanceKey, userBalance);
    localStorage.setItem(type + '_' + userId, 'true');
    updateUI();
    alert("অভিনন্দন! ১০ টাকা যোগ হয়েছে।");
}

updateUI();
