import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from flask import Flask
from threading import Thread

BOT_TOKEN = os.environ.get('BOT_TOKEN')
bot = telebot.TeleBot(BOT_TOKEN)
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

# Flask সার্ভার পোর্ট এরর এড়াতে
app = Flask('')

@app.route('/')
def home():
    return "Bot is running!"

def run():
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))

@bot.message_handler(commands=['start'])
def send_welcome(message):
    markup = InlineKeyboardMarkup()
    markup.add(InlineKeyboardButton(text="📱 Open App", web_app=WebAppInfo(url=WEB_APP_URL)))
    bot.send_message(message.chat.id, "স্বাগতম! অ্যাপ ওপেন করতে নিচে ক্লিক করুন:", reply_markup=markup)

if __name__ == "__main__":
    Thread(target=run).start()
    bot.infinity_polling()
