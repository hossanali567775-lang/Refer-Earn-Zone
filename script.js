import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Demo User
const userId = localStorage.getItem("userId") || Date.now();
localStorage.setItem("userId", userId);

document.getElementById("username").innerText = "ABIR";
document.getElementById("userid").innerText = "User ID: " + userId;

// Balance
let balance = localStorage.getItem("balance") || 0;
document.getElementById("balance").innerText = balance;

// Referral Link
const refLink =
window.location.origin +
window.location.pathname +
"?ref=" +
userId;

document.getElementById("refLink").innerText = refLink;

// Copy Button
const copyBtn = document.querySelector(".card button");

if(copyBtn){
copyBtn.onclick = () => {
navigator.clipboard.writeText(refLink);
alert("Referral Link Copied");
};
}
