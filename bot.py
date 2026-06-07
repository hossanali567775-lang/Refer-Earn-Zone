import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# আপনার বটের আসল টোকেনটি এখানে বসাবেন
BOT_TOKEN = "8843728925:AAF3tV-sNF8ooJ0CCAkPcQ8Bqe03sHx7IwU"

bot = telebot.TeleBot(BOT_TOKEN)

# আপনার গিটহাব পেজের লাইভ লিংক
WEB_APP_URL = "https://hossanali567775-lang.github.io/Refer-Earn-Zone/"

@bot.message_handler(commands=['start'])
def send_welcome(message):
    chat_id = message.chat.id
    user_name = message.from_user.first_name
    
    # স্বাগত বার্তা
    welcome_text = (
        f"👋 আসসালামু আলাইকুম, {user_name}!\n\n"
        f"আমাদের **Earn Zone** মিনি অ্যাপ বোটে আপনাকে স্বাগতম। "
        f"নিচের বোতামে ক্লিক করে অ্যাপটি ওপেন করুন এবং টাস্ক ও অ্যাড দেখে ইনকাম শুরু করুন!"
    )
    
    # ইন্টারলাইন কিবোর্ড বাটন তৈরি (ওয়েব অ্যাপের সাথে কানেক্টেড)
    markup = InlineKeyboardMarkup()
    open_app_btn = InlineKeyboardButton(
        text="📱 Open App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    markup.add(open_app_btn)
    
    # ইউজারকে মেসেজ পাঠানো
    bot.send_message(chat_id, welcome_text, reply_markup=markup, parse_mode="Markdown")

if __name__ == "__main__":
    print("Бот запущен... (بট চালু হয়েছে...)")
    bot.infinity_polling()
