import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from flask import Flask
from threading import Thread

# এনভায়রনমেন্ট ভেরিয়েবল থেকে টোকেন নেওয়া
BOT_TOKEN = os.environ.get('BOT_TOKEN')
bot = telebot.TeleBot(BOT_TOKEN)
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

# ফ্লাস্ক অ্যাপ তৈরি (সার্ভার সচল রাখার জন্য)
app = Flask('')

@app.route('/')
def home():
    return "Bot is running!"

def run_server():
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))

@bot.message_handler(commands=['start'])
def send_welcome(message):
    # আপনার কাঙ্ক্ষিত ওয়েলকাম মেসেজ
    welcome_text = (
        f"👋 আসসালামু আলাইকুম, {message.from_user.first_name}! \n\n"
        "আমাদের Earn Zone মিনি অ্যাপে আপনাকে স্বাগতম। \n"
        "নিচের বোতামে ক্লিক করে অ্যাপটি ওপেন করুন এবং টাস্ক ও রেফার থেকে ইনকাম শুরু করুন!"
    )
    
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(text="📱 Open App", web_app=WebAppInfo(url=WEB_APP_URL)))
    
    # মেসেজ পাঠানো
    bot.send_message(message.chat.id, welcome_text, reply_markup=markup)

if __name__ == "__main__":
    # সার্ভারটি আলাদা থ্রেডে চালু করা
    Thread(target=run_server).start()
    
    # বট পোলিং চালু করা
    print("Bot is polling...")
    bot.infinity_polling(timeout=60, long_polling_timeout=60)
