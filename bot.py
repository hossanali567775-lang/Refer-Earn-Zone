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
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(text="📱 Open App", web_app=WebAppInfo(url=WEB_APP_URL)))
    bot.send_message(message.chat.id, "স্বাগতম! অ্যাপ ওপেন করতে নিচে ক্লিক করুন:", reply_markup=markup)

if __name__ == "__main__":
    # সার্ভারটি আলাদা থ্রেডে চালু করা
    Thread(target=run_server).start()
    
    # বট পোলিং চালু করা (কোনো # চিহ্ন ছাড়া)
    print("Bot is polling...")
    bot.infinity_polling(timeout=60, long_polling_timeout=60)
