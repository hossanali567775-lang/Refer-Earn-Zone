import os
import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# কোডের ভেতর সরাসরি টোকেন না লিখে os.environ ব্যবহার করে লকার থেকে টোকেন ডাকা হচ্ছে
BOT_TOKEN = os.environ.get('BOT_TOKEN')

bot = telebot.TeleBot(BOT_TOKEN)

# আপনার গিটহাব পেজের সাইট লিংক
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

@bot.message_handler(commands=['start'])
def send_welcome(message):
    chat_id = message.chat.id
    user_name = message.from_user.first_name
    
    welcome_text = (
        f"👋 আসসালামু আলাইকুম, {user_name}!\n\n"
        "আমাদের **Earn Zone** মিনি অ্যাপে আপনাকে স্বাগতম।\n"
        "নিচের বোতামে ক্লিক করে অ্যাপটি ওপেন করুন এবং টাস্ক ও রেফার থেকে ইনকাম শুরু করুন!"
    )
    
    markup = InlineKeyboardMarkup()
    open_app_btn = InlineKeyboardButton(
        text="📱 Open App",
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    markup.add(open_app_btn)
    
    bot.send_message(chat_id, welcome_text, reply_markup=markup, parse_mode="Markdown")

if __name__ == "__main__":
    print("বট সফলভাবে চালু হয়েছে...")
    bot.infinity_polling()
