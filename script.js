import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update, onValue } from "firebase/database";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyA0iU2q_AVn78ICFMjbISJKXhZYkuph4Cw",
  authDomain: "refer-earn-zone.firebaseapp.com",
  databaseURL: "https://refer-earn-zone-default-rtdb.firebaseio.com",
  projectId: "refer-earn-zone",
  storageBucket: "refer-earn-zone.firebasestorage.app",
  messagingSenderId: "1035860948377",
  appId: "1:1035860948377:web:5fc19e6fcc844cec6e4f08"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ================= USER ID ================= */
let userId = localStorage.getItem("userId");

if (!userId) {
    userId = "user_" + Math.floor(Math.random() * 999999999);
    localStorage.setItem("userId", userId);
}

/* ================= CREATE USER ================= */
function createUser() {
    set(ref(db, "users/" + userId), {
        balance: 0,
        refBalance: 0,
        ads1: 0,
        ads2: 0,
        referralCount: 0,
        withdraws: []
    });
}
createUser();

/* ================= LOAD DATA ================= */
function loadData() {
    const userRef = ref(db, "users/" + userId);

    onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();

            let total = data.balance + data.refBalance;

            document.getElementById("balance").innerText = data.balance + " ৳";
            document.getElementById("refBalance").innerText = data.refBalance + " ৳";
            document.getElementById("totalBalance").innerText = total + " ৳";

            document.getElementById("ad1Count").innerText = "Used " + data.ads1 + "/10";
            document.getElementById("ad2Count").innerText = "Used " + data.ads2 + "/10";
        }
    });
}
loadData();

/* ================= JOIN GROUP ================= */
window.joinGroup = function(type) {

    let userRef = ref(db, "users/" + userId);

    get(userRef).then(snapshot => {
        let data = snapshot.val();

        let updateData = {};

        if (type === "payment") {
            updateData.balance = data.balance + 35;
            document.getElementById("paymentBtn").innerText = "✅ Joined";
        }

        if (type === "support") {
            updateData.balance = data.balance + 35;
            document.getElementById("supportBtn").innerText = "✅ Joined";
        }

        update(userRef, updateData);
    });
};

/* ================= ADS ================= */
window.watchAd = function(slot) {

    let userRef = ref(db, "users/" + userId);

    get(userRef).then(snapshot => {
        let data = snapshot.val();

        let updateData = {};

        if (slot === 1 && data.ads1 < 10) {
            updateData.ads1 = data.ads1 + 1;
            updateData.balance = data.balance + 25;
        }

        if (slot === 2 && data.ads2 < 10) {
            updateData.ads2 = data.ads2 + 1;
            updateData.balance = data.balance + 25;
        }

        update(userRef, updateData);
    });
};

/* ================= TASK ================= */
window.doTask = function(id) {

    let userRef = ref(db, "users/" + userId);

    get(userRef).then(snapshot => {
        let data = snapshot.val();

        update(userRef, {
            balance: data.balance + 25
        });
    });
};

/* ================= REF COPY ================= */
window.copyRef = function() {

    let link = window.location.origin + "?ref=" + userId;

    navigator.clipboard.writeText(link);

    document.getElementById("refLink").value = link;

    alert("Referral link copied!");
};

/* ================= WITHDRAW ================= */
window.withdraw = function() {

    let number = document.getElementById("withdrawNumber").value;
    let amount = parseInt(document.getElementById("withdrawAmount").value);

    let userRef = ref(db, "users/" + userId);

    get(userRef).then(snapshot => {
        let data = snapshot.val();

        if (data.referralCount < 10 || data.balance < 600) {
            alert("Minimum 10 referrals & 600৳ required");
            return;
        }

        let newWithdraw = {
            number,
            amount,
            time: new Date().toLocaleString()
        };

        let updatedList = data.withdraws || [];
        updatedList.push(newWithdraw);

        update(userRef, {
            withdraws: updatedList,
            balance: data.balance - amount
        });

        alert("Withdraw request sent!");
    });
};

/* ================= NAV ================= */
window.goPage = function(page) {
    document.querySelectorAll(".nav-item")
        .forEach(e => e.classList.remove("active"));

    event.target.classList.add("active");

    alert(page + " page (UI switch next upgrade)");
};
