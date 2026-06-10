import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from flask import Flask
from threading import Thread

BOT_TOKEN = os.environ.get('BOT_TOKEN')
bot = telebot.TeleBot(BOT_TOKEN)
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

app = Flask('')

@app.route('/')
def home():
    return "Bot is running!"

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(text="📱 Open App", web_app=WebAppInfo(url=WEB_APP_URL)))
    bot.send_message(message.chat.id, "স্বাগতম! অ্যাপ ওপেন করতে নিচে ক্লিক করুন:", reply_markup=markup)

def run():
    app.run(host='0.0.0.0', port=10000)

if __name__ == "__main__":
    # সার্ভার চালু রাখা
    Thread(target=run).start()
    # বট পোলিং (টেলিগ্রাম মেসেজ ধরার জন্য)
    bot.infinity_polling(timeout=60, long_polling_timeout=60)
