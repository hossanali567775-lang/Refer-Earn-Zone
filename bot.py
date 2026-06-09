import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from flask import Flask
from threading import Thread

# আপনার আগের টোকেন এবং বটের কনফিগারেশন
BOT_TOKEN = os.environ.get('BOT_TOKEN')
bot = telebot.TeleBot(BOT_TOKEN)
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

# ফ্লাস্ক সার্ভার (পোর্ট এরর এড়াতে)
app = Flask('')

@app.route('/')
def home():
    return "Bot is running!"

def run():
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))

# বটের মূল ফাংশন আগের মতোই থাকবে
@bot.message_handler(commands=['start'])
def send_welcome(message):
    chat_id = message.chat.id
    user_name = message.from_user.first_name
    welcome_text = f"👋 আসসালামু আলাইকুম, {user_name}!\n\nআমাদের **Earn Zone** মিনি অ্যাপে আপনাকে স্বাগতম।"
    markup = InlineKeyboardMarkup()
    open_app_btn = InlineKeyboardButton(text="📱 Open App", web_app=WebAppInfo(url=WEB_APP_URL))
    markup.add(open_app_btn)
    bot.send_message(chat_id, welcome_text, reply_markup=markup, parse_mode="Markdown")

if __name__ == "__main__":
    # ফ্লাস্ক সার্ভার চালু হচ্ছে
    Thread(target=run).start()
    # বট পোলিং চালু হচ্ছে
    print("বট সফলভাবে চালু হয়েছে...")
    bot.infinity_polling()
