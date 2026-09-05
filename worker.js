/**
 * Cloudflare Worker برای ربات تلگرام اقامتگاه بومگردی «خانه برزک»
 * 
 * متغیرهای محیطی در Cloudflare Dashboard > Workers > Settings > Variables:
 * - BOT_TOKEN: توکن بات تلگرام دریافتی از BotFather
 * - MINI_APP_URL: آدرس مینی‌اپ در Cloudflare Pages یا هاست شما (مثلاً https://barzokhouse.pages.dev)
 */

export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET") {
      return new Response(
        `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head><meta charset="utf-8"><title>ربات خانه برزک</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 50px; background: #fdfbf7;">
  <h2 style="color: #233e33;">اقامتگاه بومگردی خانه برزک</h2>
  <p style="color: #555;">وب‌هوک ربات تلگرام با موفقیت فعال است.</p>
  <p><a href="${env.MINI_APP_URL || '#'}" style="color: #bc8a3c; text-decoration: none; font-weight: bold;">مشاهده مینی‌اپ ←</a></p>
</body>
</html>`,
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const update = await request.json();
      if (update.message) {
        await handleMessage(update.message, env);
      }
      return new Response("OK", { status: 200 });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  }
};

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const text = message.text || "";
  const token = env.BOT_TOKEN;
  const appUrl = env.MINI_APP_URL || "https://barzokhouse.com";

  if (!token) return;

  // پاسخ به دستور /start یا پیام‌های خوش‌آمدگویی
  if (text.startsWith("/start") || text === "منو" || text === "شروع") {
    const welcomeText = 
`سلام 👋 به اقامتگاه بومگردی «خانه برزک» خوش آمدید!

🏡 تجربه‌ای آرام و اصیل در میان باغات شاتوت و کوهستان‌های دل‌انگیز برزک (نزدیک کاشان).

برای مشاهده اتاق‌ها، گالری تصاویر، قیمت‌ها، منوی غذای محلی و ثبت رزرو، روی دکمه زیر بزنید:`;

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
            { text: "📞 تماس با پذیرش", url: "https://barzokhouse.com" },
            { text: "📍 لوکیشن و نقشه", url: "https://maps.app.goo.gl/9ZzS3Uu4n8DqgXqf8" }
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
