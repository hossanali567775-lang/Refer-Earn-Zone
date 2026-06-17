const firebaseConfig = { apiKey: "AIzaSyA0iU2q_AVn78ICFMjbISJKXhZYkuph4Cw", databaseURL: "https://refer-earn-zone-default-rtdb.firebaseio.com", projectId: "refer-earn-zone" };
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// এখানে আপনার বাটন ক্লিক ও ব্যালেন্স আপডেটের লজিকগুলো লিখুন...
// উদাহরণস্বরূপ:
function copyReferLink() {
    navigator.clipboard.writeText("https://t.me/bdfreeincometkBot/app?start=6763447817");
    alert("লিংক কপি হয়েছে!");
}

function requestWithdraw() {
    alert("উইথড্র রিকোয়েস্ট পাঠানো হয়েছে!");
}
