/**
 * Cloudflare Worker برای ربات تلگرام و سیستم رزرو اقامتگاه بومگردی «خانه برزک»
 * 
 * متغیرهای محیطی در Cloudflare Dashboard > Workers > Settings > Variables:
 * - BOT_TOKEN: توکن بات تلگرام دریافتی از BotFather
 * - RESERVATION_CHAT_ID: شناسه عددی گروه رزرو خانه برزک (مثلاً 100xxxxxxxxxx-)
 * - MINI_APP_URL: آدرس مینی‌اپ در Cloudflare Pages یا هاست شما
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export default {
  async fetch(request, env, ctx) {
    // پاسخ به درخواست‌های مقدماتی CORS (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    if (request.method === "GET") {
      return new Response(
        `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="utf-8"><title>سرویس رزرو خانه برزک</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 40px; background: #faf8f5; color: #1c2b24;">
  <h2 style="color: #1f8578;">اقامتگاه بومگردی خانه برزک</h2>
  <p style="color: #4b6358;">سرویس ارتباطی وب‌هوک و ثبت رزرو یکپارچه فعال است.</p>
  <p style="font-size: 14px; color: #768079;">لینک گروه رزرو: <a href="https://t.me/+wigY6VanuYplYTk8" target="_blank" style="color: #b88648;">گروه رزرو خانه برزک</a></p>
  <p><a href="${env.MINIAPP_URL || env.MINI_APP_URL || '#'}" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #1f8578; color: #fff; text-decoration: none; border-radius: 8px;">ورود به مینی‌اپ</a></p>
</body>
</html>`,
        { headers: { ...CORS_HEADERS, "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    try {
      const url = new URL(request.url);
      const payload = await request.json();

      // ۱. دریافت درخواست مستقیم از فرانت‌اند مینی‌اپ (API Reservation Endpoint)
      if (url.pathname.includes("/api/reserve") || payload.action === "submit_reservation" || payload.isMiniAppOrder) {
        const result = await handleDirectReservation(payload, env);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
        });
      }

      // ۲. دریافت آپدیت‌های تلگرام از Webhook
      if (payload.message || payload.my_chat_member) {
        await handleTelegramUpdate(payload, env);
      }

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }
  }
};

/**
 * پردازش درخواست ثبت یکپارچه ارسالی مستقیم از مینی‌اپ
 */
async function handleDirectReservation(payload, env) {
  const token = env.BOT_TOKEN;
  const groupId = env.CHAT_ID || env.RESERVATION_CHAT_ID;
  const messageText = payload.message || "درخواست رزرو جدید ثبت شد.";

  if (!token) {
    return { ok: false, note: "BOT_TOKEN در متغیرهای Cloudflare Worker تنظیم نشده است." };
  }

  // اگر شناسه گروه یا اکانت ادمین تنظیم شده باشد، پیام مستقیماً ارسال می‌شود
  if (groupId) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: groupId,
        text: messageText,
        disable_web_page_preview: true
      })
    });
    const resData = await res.json();
    return { ok: resData.ok === true, forwarded_to_group: resData.ok === true, telegram_res: resData };
  }

  return { 
    ok: false, 
    forwarded_to_group: false, 
    note: "شناسه گفتگوی تلگرام (RESERVATION_CHAT_ID یا CHAT_ID) در تنظیمات Worker مشخص نشده است. لطفاً آن را در متغیرهای Cloudflare وارد کنید." 
  };
}

/**
 * مدیریت رویدادها و آپدیت‌های دریافتی از تلگرام
 */
async function handleTelegramUpdate(update, env) {
  const token = env.BOT_TOKEN;
  if (!token) return;

  // بررسی اضافه شدن ربات به گروه جهت اعلام شناسه گروه
  if (update.my_chat_member) {
    const chat = update.my_chat_member.chat;
    const status = update.my_chat_member.new_chat_member?.status;
    if (status === "member" || status === "administrator") {
      await sendTelegramMessage(token, chat.id, 
        `سلام! اقامتگاه بومگردی خانه برزک 🏡\n\nربات با موفقیت به این گروه افزوده شد.\n📌 شناسه (Chat ID) این گروه: \`${chat.id}\`\n\nلطفاً این شناسه را در متغیر RESERVATION_CHAT_ID در تنظیمات Cloudflare Worker ذخیره کنید تا درخواست‌های رزرو یکپارچه به این گروه هدایت شوند.`
      );
    }
    return;
  }

  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || "";
  const appUrl = env.MINIAPP_URL || env.MINI_APP_URL || "https://barzokhouse.com";

  // الف: دریافت داده‌های ارسالی از مینی‌اپ (tg.sendData)
  if (message.web_app_data && message.web_app_data.data) {
    const reservationData = message.web_app_data.data;
    
    // ارسال به گروه مدیریت رزرو
    const targetGroup = env.CHAT_ID || env.RESERVATION_CHAT_ID;
    if (targetGroup) {
      await sendTelegramMessage(token, targetGroup, reservationData);
    }

    // ارسال تاییدیه به مسافر در چت شخصی
    await sendTelegramMessage(token, chatId, 
      "درخواست یکپارچه شما با موفقیت ثبت شد و به گروه رزرو خانه برزک ارسال گردید. همکاران ما به زودی جهت هماهنگی با شما تماس خواهند گرفت. سپاس از انتخاب شما 🙏"
    );
    return;
  }

  // ب: دستور دریافت شناسه گروه
  if (text.startsWith("/id") || text.startsWith("/chatid")) {
    await sendTelegramMessage(token, chatId, 
      `📌 شناسه این گفتگو (Chat ID): \`${chatId}\`\nنوع چت: ${message.chat.type}`
    );
    return;
  }

  // ج: پاسخ به دستور /start
  if (text.startsWith("/start") || text === "منو" || text === "شروع") {
    const welcomeText = 
`سلام 👋 به اقامتگاه بومگردی «خانه برزک» خوش آمدید!

🏡 تجربه‌ای آرام و اصیل در میان باغات شاتوت و کوهستان‌های دل‌انگیز برزک (نزدیک کاشان).

برای مشاهده اتاق‌ها، قیمت‌ها، منوی غذای محلی و ثبت یکجای درخواست اقامت و خوراک، روی دکمه زیر بزنید:`;

    const payload = {
      chat_id: chatId,
      text: welcomeText,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🏡 ورود به مینی‌اپ خانه برزک",
              web_app: { url: appUrl }
            }
          ],
          [
            { text: "👥 گروه رزرو خانه برزک", url: "https://t.me/+wigY6VanuYplYTk8" },
            { text: "📞 وب‌سایت خانه برزک", url: "https://barzokhouse.com" }
          ]
        ]
      }
    };

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
}

async function sendTelegramMessage(token, chatId, text) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })
    });
  } catch (err) {
    console.error("sendTelegramMessage error:", err);
  }
}

