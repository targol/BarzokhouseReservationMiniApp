// Cloudflare Pages Function: /api/reserve
function resolveBotToken(env, payload) {
  let token = null;
  if (env && typeof env === "object") {
    token = env.BOT_TOKEN || env.bot_token || env.Bot_Token ||
            env.TELEGRAM_BOT_TOKEN || env.telegram_bot_token || env.Telegram_Bot_Token ||
            env.TOKEN || env.token || env.Token ||
            env.TELEGRAM_TOKEN || env.telegram_token ||
            env.TG_BOT_TOKEN || env.tg_bot_token ||
            env.TG_TOKEN || env.tg_token ||
            env.BOTTOKEN || env.bottoken ||
            env.BARZOK_BOT_TOKEN || env.barzok_bot_token;

    if (!token) {
      for (const [, val] of Object.entries(env)) {
        if (typeof val === "string") {
          const cleanVal = val.trim().replace(/^["']+|["']+$/g, "");
          if (/^\d{7,12}:[A-Za-z0-9_-]{20,}$/.test(cleanVal) || /^bot\d{7,12}:[A-Za-z0-9_-]{20,}$/i.test(cleanVal)) {
            token = cleanVal;
            break;
          }
        }
      }
    }
  }

  if (!token && payload && payload.botToken) {
    token = payload.botToken;
  }

  if (typeof token === "string") {
    token = token.trim().replace(/^["']+|["']+$/g, "");
    if (token.toLowerCase().startsWith("bot") && !token.startsWith("bot_") && token.includes(":")) {
      token = token.slice(3).trim();
    }
  }

  return token || null;
}

function resolveChatId(env, payload) {
  let chatId = null;
  if (env && typeof env === "object") {
    chatId = env.RESERVATION_CHAT_ID || env.reservation_chat_id ||
             env.CHAT_ID || env.chat_id ||
             env.TELEGRAM_CHAT_ID || env.telegram_chat_id ||
             env.GROUP_ID || env.group_id ||
             env.CHATID || env.chatid;

    if (!chatId) {
      for (const [, val] of Object.entries(env)) {
        if (typeof val === "string" || typeof val === "number") {
          const s = String(val).trim();
          if (/^-100\d{8,14}$/.test(s) || /^-\d{7,14}$/.test(s)) {
            chatId = s;
            break;
          }
        }
      }
    }
  }
  if (!chatId && payload && payload.chatId) {
    chatId = payload.chatId;
  }
  return chatId ? String(chatId).trim() : "-1004485664573";
}

export async function onRequestGet({ env }) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };

  const token = resolveBotToken(env, null);
  const chatId = resolveChatId(env, null);
  const envKeys = env ? Object.keys(env) : [];

  return new Response(JSON.stringify({ 
    ok: true, 
    service: "سرویس ثبت رزرو خانه برزک",
    has_bot_token: !!token,
    token_prefix: token ? (token.split(':')[0] + ':***') : null,
    has_chat_id: !!chatId,
    chat_id: chatId,
    available_env_keys: envKeys
  }), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
  });
}

export async function onRequestPost({ request, env }) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };

  try {
    const payload = await request.json().catch(() => ({}));
    const token = resolveBotToken(env, payload);
    let configuredGroupId = resolveChatId(env, payload);
    const messageText = payload.message || "درخواست رزرو جدید ثبت شد.";

    if (!token) {
      const envKeys = env ? Object.keys(env) : [];
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "BOT_TOKEN_NOT_CONFIGURED",
        detected_keys: envKeys,
        note: `متغیر BOT_TOKEN در متغیرهای Cloudflare یافت نشد. لطفاً در پنل Cloudflare در بخش Settings > Variables متغیر BOT_TOKEN را ثبت و ذخیره (Save and Deploy) فرمایید. (کلیدهای فعال فعلی: ${envKeys.length > 0 ? envKeys.join(', ') : 'بدون متغیر'})` 
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    configuredGroupId = String(configuredGroupId).trim();
    if (configuredGroupId.includes("t.me") || configuredGroupId.startsWith("+")) {
      return new Response(JSON.stringify({
        ok: false,
        error: "INVALID_CHAT_ID",
        note: "در متغیر RESERVATION_CHAT_ID لینک تلگرام وارد شده است. شناسه عددی صحیح گروه -1004485664573 می‌باشد."
      }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // کاندیداهای شناسه (هر دو فرمت سوپرگروه -100 و گروه عادی -)
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
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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
          return new Response(JSON.stringify({ 
            ok: true, 
            forwarded_to_group: true, 
            used_chat_id: targetChatId,
            message_id: resData.result?.message_id,
            note: "پیام با موفقیت در گروه رزرو خانه برزک ثبت شد." 
          }), {
            status: 200,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }
        lastResData = resData;
      } catch (err) {
        lastError = err;
      }
    }

    let userFriendlyNote = "تلگرام پیام را ثبت نکرد.";
    const errDesc = (lastResData && lastResData.description) || (lastError && lastError.message) || "";
    const errCode = (lastResData && lastResData.error_code) || 0;

    if (errCode === 401 || errDesc.toLowerCase().includes("unauthorized")) {
      userFriendlyNote = "توکن ربات تلگرام در تلگرام نامعتبر است (Error 401 Unauthorized). لطفاً توکن جدید BotFather را در متغیر BOT_TOKEN بررسی فرمایید.";
    } else if (errCode === 400 && errDesc.toLowerCase().includes("chat not found")) {
      userFriendlyNote = `شناسه گروه رزرو تلگرام (${configuredGroupId}) یافت نشد. لطفاً از عضویت و دسترسی ربات در گروه اطمینان حاصل فرمایید.`;
    } else if (errCode === 403 || errDesc.toLowerCase().includes("bot is not a member")) {
      userFriendlyNote = "ربات در گروه رزرو عضو نیست یا دسترسی ارسال پیام ندارد. لطفاً ربات را به گروه اضافه کرده و ادمین کنید.";
    } else if (errDesc) {
      userFriendlyNote = `پاسخ تلگرام: ${errDesc}`;
    }

    return new Response(JSON.stringify({ 
      ok: false, 
      error: errDesc || "Telegram error",
      telegram_error_code: errCode,
      note: userFriendlyNote 
    }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message, note: err.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    }
  });
}
