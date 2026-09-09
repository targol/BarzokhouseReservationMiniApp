// Cloudflare Pages Function: /api/reserve
export async function onRequestPost({ request, env }) {
  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };

  try {
    const payload = await request.json().catch(() => ({}));
    const token = env.BOT_TOKEN || env.TELEGRAM_BOT_TOKEN || env.TOKEN || env.TELEGRAM_TOKEN || "691903257:AAfeOUEmpfHkElZUb8JFUTmOhLU79b6--zQ";
    let configuredGroupId = env.RESERVATION_CHAT_ID || env.CHAT_ID || env.TELEGRAM_CHAT_ID || env.GROUP_ID || env.CHATID || "-1004485664573";
    const messageText = payload.message || "درخواست رزرو جدید ثبت شد.";

    if (!token) {
      return new Response(JSON.stringify({ 
        ok: false, 
        error: "BOT_TOKEN_NOT_CONFIGURED",
        note: "توکن بات تلگرام (BOT_TOKEN) در متغیرهای Cloudflare تنظیم نشده است." 
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
        note: "در متغیر RESERVATION_CHAT_ID لینک تلگرام وارد شده است. شناسه عددی صحیح گروه -1004485664573 یا -4485664573 می‌باشد."
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
      userFriendlyNote = "توکن ربات تلگرام نامعتبر است (Error 401 Unauthorized). لطفاً توکن BotFather را در متغیر BOT_TOKEN بررسی فرمایید.";
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
