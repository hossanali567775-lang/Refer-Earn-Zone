let balance = parseFloat(localStorage.getItem('userBalance')) || 100.00;
document.getElementById('balance').innerText = '৳' + balance.toFixed(2);

function startTask(btn, amount, link) {
    let timeLeft = 10;
    btn.disabled = true;
    btn.innerText = timeLeft + "s";
    
    // বিজ্ঞাপন ওপেন হবে
    window.open(link, '_blank');

    // টাইমার শুরু
    let timer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            btn.innerText = timeLeft + "s";
        } else {
            clearInterval(timer);
            // ব্যালেন্স অ্যাড হবে
            balance += amount;
            localStorage.setItem('userBalance', balance);
            document.getElementById('balance').innerText = '৳' + balance.toFixed(2);
            
            // বাটন সম্পন্ন হয়ে যাবে
            btn.innerText = "সম্পন্ন";
            btn.style.backgroundColor = "#333";
            btn.style.color = "#888";
        }
    }, 1000);
}
