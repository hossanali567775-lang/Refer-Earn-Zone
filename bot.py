from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# ⚠️ আপনার বটের টোকেন এবং এডমিন আইডি এখানে বসান
TOKEN = '8843728925:AAF3tV-sNF8ooJ0CCAkPcQ8Bqe03sHx7IwU'
ADMIN_ID = 7588246972 

REFERRAL_STATUS = True
user_data = {}

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global REFERRAL_STATUS
    user_id = update.effective_user.id
    user_name = update.effective_user.first_name
    
    if user_id not in user_data:
        user_data[user_id] = {'points': 0, 'referred_by': None, 'refer_count': 0}
    
    if context.args and REFERRAL_STATUS:
        referrer_id = int(context.args[0])
        if referrer_id != user_id and user_data[user_id]['referred_by'] is None:
            user_data[user_id]['referred_by'] = referrer_id
            if referrer_id in user_data:
                user_data[referrer_id]['points'] += 10
                user_data[referrer_id]['refer_count'] += 1
                try:
                    await context.bot.send_message(chat_id=referrer_id, text=f"🎉 অভিনন্দন! {user_name} আপনার লিংকে জয়েন করেছে। আপনি ১০ পয়েন্ট পেয়েছেন!")
                except: pass
    elif context.args and not REFERRAL_STATUS:
        await update.message.reply_text("⚠️ দুঃখিত, বর্তমানে রেফারেল সিস্টেমটি বন্ধ আছে।")

    bot_username = context.bot.username
    ref_link = f"https://t.me/{bot_username}?start={user_id}"
    status_text = "🟢 ওপেন (Open)" if REFERRAL_STATUS else "🔴 বন্ধ (Closed)"
    
    welcome_text = f"👋 স্বাগতম {user_name} আমাদের Refer Earn Zone বটে!\n\n📢 স্ট্যাটাস: {status_text}\n🔗 লিংক:\n{ref_link}\n\n👥 মোট রেফার: {user_data[user_id]['refer_count']} জন\n💰 মোট পয়েন্ট: {user_data[user_id]['points']} Points"
    await update.message.reply_text(welcome_text)

async def control_panel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global REFERRAL_STATUS
    if update.effective_user.id != ADMIN_ID:
        await update.message.reply_text("❌ আপনি এডমিন নন!")
        return
    if context.args:
        command = context.args[0].lower()
        if command == "open":
            REFERRAL_STATUS = True
            await update.message.reply_text("🟢 রেফারেল সিস্টেম OPEN করা হয়েছে!")
        elif command == "close":
            REFERRAL_STATUS = False
            await update.message.reply_text("🔴 রেফারেল সিস্টেম CLOSE করা হয়েছে!")
    else:
        current_status = "🟢 Open" if REFERRAL_STATUS else "🔴 Close"
        await update.message.reply_text(f"ℹ️ বর্তমানে সিস্টেম {current_status} আছে।")

if __name__ == '__main__':
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler('start', start))
    app.add_handler(CommandHandler('control', control_panel))
    app.run_polling()
