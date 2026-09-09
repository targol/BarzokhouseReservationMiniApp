const fs = require('fs');
const path = require('path');

// 1. Read index.html, style.css, app.js
let html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// 2. Inline style.css into index.html
html = html.replace(/<link[^>]*href=["'][^"']*style\.css["'][^>]*>/i, `<style>\n${css}\n</style>`);

// 3. Inline app.js into index.html
html = html.replace(/<script[^>]*src=["'][^"']*app\.js["'][^>]*><\/script>/i, `<script>\n${js}\n</script>`);

// 4. Encode to Base64
const base64Html = Buffer.from(html, 'utf8').toString('base64');

// 5. Read worker template or generate worker.js
const workerTemplate = `/**
 * Cloudflare Worker تمام‌عیار و خودکفا برای ربات تلگرام و مینی‌اپ اقامتگاه بومگردی «خانه برزک»
 * 
 * ویژگی‌های این نسخه:
 * ۱. مینی‌اپ تلگرام به طور کامل (HTML + CSS + JS) درون این ورکر جاسازی شده و مستقیماً باز می‌شود
 *    (بدون هیچ صفحه واسط، بدون نیاز به هاست مجزا، بدون دکمه اضافه «ورود به مینی‌اپ»).
 * ۲. ثبت رزرو یکپارچه و مستقیم در گروه تلگرام از طریق اندپوینت /api/reserve
 * ۳. پاسخ خودکار به دستورات تلگرام (/start, /id) و تنظیم دکمه Menu Button تلگرام
 * 
 * متغیرهای اختیاری در Cloudflare Dashboard > Workers > Settings > Variables:
 * - BOT_TOKEN: توکن بات تلگرام دریافتی از BotFather (پیش‌فرض هوشمند روی توکن خانه برزک تنظیم است)
 * - RESERVATION_CHAT_ID: شناسه عددی گروه رزرو خانه برزک (مثلاً 1004485664573- یا 4485664573-)
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
};

// کد کامل و فشرده مینی‌اپ خانه برزک (به صورت Base64 UTF-8)
const EMBEDDED_MINIAPP_B64 = "__EMBEDDED_MINIAPP_B64__";

// متغیر کش در حافظه برای دیکد یک‌باره مینی‌اپ
let cachedMiniAppHtml = null;

function decodeBase64Utf8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

function getMiniAppHtml() {
  if (!cachedMiniAppHtml) {
    cachedMiniAppHtml = decodeBase64Utf8(EMBEDDED_MINIAPP_B64);
  }
  return cachedMiniAppHtml;
}

export default {
  async fetch(request, env, ctx) {
    // پاسخ به درخواست‌های مقدماتی CORS (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    const url = new URL(request.url);

    // ۱. هندل کردن مسیر اختصاصی API ثبت رزرو مینی‌اپ (/api/reserve)
    if (url.pathname === "/api/reserve" || url.pathname.startsWith("/api/reserve")) {
      if (request.method === "POST") {
        try {
          const payload = await request.json();
          const result = await handleDirectReservation(payload, env);
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        } catch (err) {
          return new Response(JSON.stringify({ ok: false, error: err.message, note: "خطا در خواندن داده‌های ارسالی" }), {
            status: 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }
      }
      // در صورت درخواست GET برای تست سلامت اندپوینت
      return new Response(JSON.stringify({ 
        ok: true, 
        service: "سرویس ثبت رزرو خانه برزک",
        has_bot_token: !!(env.BOT_TOKEN || env.TELEGRAM_BOT_TOKEN),
        has_chat_id: !!(env.RESERVATION_CHAT_ID || env.CHAT_ID)
      }), {
        status: 200,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // ۲. دریافت آپدیت‌ها و درخواست‌های POST از وب‌هوک یا روت اصلی
    if (request.method === "POST") {
      try {
        const payload = await request.json();

        // اگر مینی‌اپ مستقیماً به روت اصلی درخواست داده باشد
        if (payload.action === "submit_reservation" || payload.isMiniAppOrder || payload.message) {
          const result = await handleDirectReservation(payload, env);
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 400,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }

        // پردازش آپدیت‌های تلگرام
        if (payload.update_id || payload.my_chat_member) {
          await handleTelegramUpdate(payload, env, url);
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (err) {
        console.error("Worker error:", err);
        return new Response(JSON.stringify({ ok: false, error: err.message }), {
          status: 500,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }
    }

    // ۳. در صورتی که فایل‌های استاتیک در Cloudflare Pages بایند شده باشد
    if (env.ASSETS && typeof env.ASSETS.fetch === "function") {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    // ۴. باز کردن مستقیم و بدون واسطه مینی‌اپ کامل خانه برزک برای مسافر
    if (url.pathname === "/" || url.pathname === "/index.html" || !url.pathname.includes(".")) {
      return new Response(getMiniAppHtml(), {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300"
        }
      });
    }

    return new Response(getMiniAppHtml(), {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
};

/**
 * پردازش درخواست ثبت یکپارچه ارسالی مستقیم از مینی‌اپ
 */
async function handleDirectReservation(payload, env) {
  const token = env.BOT_TOKEN || env.TELEGRAM_BOT_TOKEN || env.TOKEN || env.TELEGRAM_TOKEN || "691903257:AAfeOUEmpfHkElZUb8JFUTmOhLU79b6--zQ";
  let configuredGroupId = env.RESERVATION_CHAT_ID || env.CHAT_ID || env.TELEGRAM_CHAT_ID || env.GROUP_ID || env.CHATID || "-1004485664573";
  const messageText = payload.message || "درخواست رزرو جدید ثبت شد.";

  if (!token) {
    return { 
      ok: false, 
      error: "BOT_TOKEN_NOT_CONFIGURED",
      note: "توکن بات تلگرام (BOT_TOKEN) در متغیرهای Cloudflare یافت نشد. لطفاً در Settings > Variables کلادفلر آن را ثبت نمایید." 
    };
  }

  configuredGroupId = String(configuredGroupId).trim();
  if (configuredGroupId.includes("t.me") || configuredGroupId.startsWith("+")) {
    return {
      ok: false,
      error: "INVALID_CHAT_ID",
      note: "در متغیر RESERVATION_CHAT_ID لینک تلگرام وارد شده است. شناسه عددی صحیح گروه -1004485664573 یا -4485664573 می‌باشد."
    };
  }

  const candidateIds = [configuredGroupId];
  if (configuredGroupId.startsWith("-100")) {
    const rawId = "-" + configuredGroupId.slice(4);
    if (!candidateIds.includes(rawId)) candidateIds.push(rawId);
  } else if (configuredGroupId.startsWith("-")) {
    const superId = "-100" + configuredGroupId.slice(1);
    if (!candidateIds.includes(superId)) candidateIds.push(superId);
  }

  let lastResData = null;
  let lastError = null;

  for (const targetChatId of candidateIds) {
    try {
      const res = await fetch(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: messageText,
          disable_web_page_preview: true
        })
      });

      const resData = await res.json().catch(() => ({}));
      if (resData && resData.ok === true) {
        return { 
          ok: true, 
          forwarded_to_group: true, 
          used_chat_id: targetChatId,
          message_id: resData.result?.message_id,
          note: "پیام با موفقیت در گروه رزرو تلگرام خانه برزک ثبت گردید." 
        };
      }
      lastResData = resData;
    } catch (netErr) {
      lastError = netErr;
    }
  }

  let userFriendlyNote = "تلگرام پیام را ثبت نکرد.";
  const errDesc = (lastResData && lastResData.description) || (lastError && lastError.message) || "";
  const errCode = (lastResData && lastResData.error_code) || 0;

  if (errCode === 401 || errDesc.toLowerCase().includes("unauthorized")) {
    userFriendlyNote = "توکن ربات تلگرام نامعتبر است (Error 401 Unauthorized). لطفاً توکن دریافتی از BotFather را در متغیر BOT_TOKEN بررسی فرمایید.";
  } else if (errCode === 400 && errDesc.toLowerCase().includes("chat not found")) {
    userFriendlyNote = \`شناسه گروه رزرو تلگرام (\${configuredGroupId}) یافت نشد. لطفاً از عضویت و دسترسی ربات در گروه اطمینان حاصل فرمایید.\`;
  } else if (errCode === 403 || errDesc.toLowerCase().includes("bot is not a member")) {
    userFriendlyNote = "ربات در گروه رزرو عضو نیست یا دسترسی ارسال پیام ندارد. لطفاً ربات را به این گروه اضافه کرده و دسترسی ادمین دهید.";
  } else if (errDesc) {
    userFriendlyNote = \`پاسخ تلگرام: \${errDesc}\`;
  }

  return { 
    ok: false, 
    error: errDesc || "خطای ارسال به تلگرام",
    telegram_error_code: errCode,
    note: userFriendlyNote
  };
}

/**
 * مدیریت رویدادها و آپدیت‌های دریافتی از تلگرام
 */
async function handleTelegramUpdate(update, env, currentUrl) {
  const token = env.BOT_TOKEN || env.TELEGRAM_BOT_TOKEN || "691903257:AAfeOUEmpfHkElZUb8JFUTmOhLU79b6--zQ";
  if (!token) return;

  if (update.my_chat_member) {
    const chat = update.my_chat_member.chat;
    const status = update.my_chat_member.new_chat_member?.status;
    if (status === "member" || status === "administrator") {
      await sendTelegramMessage(token, chat.id, 
        \`سلام! اقامتگاه بومگردی خانه برزک 🏡\\n\\nربات با موفقیت به این گروه افزوده شد.\\n📌 شناسه (Chat ID) این گروه: \\\`\${chat.id}\\\`\\n\\nدر صورت نیاز این شناسه را در متغیر RESERVATION_CHAT_ID در تنظیمات Cloudflare Worker ذخیره کنید.\`
      );
    }
    return;
  }

  const message = update.message;
  if (!message) return;

  const chatId = message.chat.id;
  const text = message.text || "";
  const appUrl = env.MINIAPP_URL || env.MINI_APP_URL || \`https://\${currentUrl.host}\`;

  // الف: دریافت داده‌های ارسالی از مینی‌اپ
  if (message.web_app_data && message.web_app_data.data) {
    const reservationData = message.web_app_data.data;
    const targetGroup = env.CHAT_ID || env.RESERVATION_CHAT_ID || "-1004485664573";
    if (targetGroup) {
      await sendTelegramMessage(token, targetGroup, reservationData);
    }

    await sendTelegramMessage(token, chatId, 
      "درخواست یکپارچه شما با موفقیت ثبت شد و به گروه رزرو خانه برزک ارسال گردید. همکاران ما به زودی جهت هماهنگی با شما تماس خواهند گرفت. سپاس از انتخاب شما 🙏"
    );
    return;
  }

  // ب: دستور دریافت شناسه گروه
  if (text.startsWith("/id") || text.startsWith("/chatid")) {
    await sendTelegramMessage(token, chatId, \`📌 شناسه عددی (Chat ID) این گفتگو:\\n\\\`\${chatId}\\\`\`);
    return;
  }

  // ج: پاسخ به دستور /start
  if (text.startsWith("/start") || text === "منو" || text === "شروع") {
    const firstName = message.from?.first_name || "مهمان گرامی";
    const welcomeText = \`سلام \${firstName} عزیز! به اقامتگاه بومگردی «خانه برزک» خوش آمدید 🌸

🏡 تجربه‌ای آرام و اصیل در میان باغات شاتوت و کوهستان‌های دل‌انگیز برزک (نزدیک کاشان).

برای ورود به مینی‌اپ، مشاهده اتاق‌ها، قیمت‌ها، منوی غذای محلی و ثبت درخواست اقامت، روی دکمه زیر بزنید:\`;

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
          ]
        ]
      }
    };

    // ۱. ارسال پیام با دکمه وب‌اپ
    await fetch(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    // ۲. تنظیم دکمه منوی تلگرام (Menu Button) برای ورود مستقیم دائمی به مینی‌اپ
    try {
      await fetch(\`https://api.telegram.org/bot\${token}/setChatMenuButton\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          menu_button: {
            type: "web_app",
            text: "🏡 به خانه برزک خوش آمدید",
            web_app: { url: appUrl }
          }
        })
      });
    } catch (_) {}
  }
}

async function sendTelegramMessage(token, chatId, text) {
  try {
    const res = await fetch(\`https://api.telegram.org/bot\${token}/sendMessage\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        disable_web_page_preview: true
      })
    });
    return await res.json().catch(() => ({}));
  } catch (err) {
    console.error("sendTelegramMessage error:", err);
    return null;
  }
}
`;

const finalWorkerCode = workerTemplate.replace('"__EMBEDDED_MINIAPP_B64__"', JSON.stringify(base64Html));

fs.writeFileSync(path.join(__dirname, '../worker.js'), finalWorkerCode, 'utf8');
console.log('Successfully generated self-contained worker.js! Size:', Math.round(finalWorkerCode.length / 1024), 'KB');
