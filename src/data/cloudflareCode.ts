export const generateWorkerJs = (
  botToken: string = '7123456789:AAHnFwcEAAAAAOcXBsQW9J2gSampleToken',
  miniAppUrl: string = 'https://my-telegram-miniapp.pages.dev',
  secretToken: string = 'my_super_secret_token_123'
) => `/**
 * Telegram Bot & Mini App Backend on Cloudflare Workers
 * Language: JavaScript (ES Modules)
 * Runtime: Cloudflare Workers (V8 / Web Standards)
 */

// Configuration (can also be set in Wrangler secrets or env)
const BOT_TOKEN = "${botToken}";
const MINI_APP_URL = "${miniAppUrl}";
const SECRET_TOKEN = "${secretToken}";

const TELEGRAM_API = "https://api.telegram.org/bot" + BOT_TOKEN;

export default {
  /**
   * Handle incoming HTTP requests from Telegram Webhook & Mini App API
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight requests for Mini App API calls
    if (request.method === "OPTIONS") {
      return handleCors();
    }

    // 1. Health check & status endpoint
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(JSON.stringify({
        status: "active",
        service: "Telegram Bot & Mini App on Cloudflare Workers",
        time: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    // 2. Validate Telegram InitData API endpoint (called from Mini App)
    if (url.pathname === "/api/validate-init-data" && request.method === "POST") {
      try {
        const body = await request.json();
        const initData = body.initData;

        if (!initData) {
          return jsonResponse({ valid: false, error: "No initData provided" }, 400);
        }

        const isValid = await verifyTelegramInitData(initData, BOT_TOKEN);
        return jsonResponse({
          valid: isValid,
          message: isValid ? "initData signature verified successfully!" : "Invalid hash signature"
        });
      } catch (err) {
        return jsonResponse({ valid: false, error: err.message }, 500);
      }
    }

    // 3. Telegram Webhook Handler (POST /webhook or POST /)
    if (request.method === "POST") {
      // Optional: Verify Telegram secret token for security
      const receivedSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
      if (SECRET_TOKEN && receivedSecret && receivedSecret !== SECRET_TOKEN) {
        return new Response("Unauthorized", { status: 403 });
      }

      try {
        const update = await request.json();
        await handleTelegramUpdate(update);
        return new Response("OK", { status: 200 });
      } catch (error) {
        console.error("Error processing update:", error);
        return new Response("Internal Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};

/**
 * Handle Telegram Update (Messages, Commands, WebApp Data)
 */
async function handleTelegramUpdate(update) {
  if (!update.message) return;

  const message = update.message;
  const chatId = message.chat.id;
  const text = message.text || "";
  const firstName = message.from.first_name || "کاربر عزیز";

  // Check if update received from Telegram Mini App via sendData()
  if (message.web_app_data) {
    const rawData = message.web_app_data.data;
    let parsedData = rawData;
    try {
      parsedData = JSON.parse(rawData);
    } catch (_) {}

    await sendTelegramMessage(chatId, \`✅ **اطلاعات مینی‌اپ دریافت شد!**\\n\\n📦 داده ارسالی:\\n\`\`\`json\\n\${JSON.stringify(parsedData, null, 2)}\\n\`\`\`\\nبا تشکر از استفاده شما!\`, {
      parse_mode: "Markdown"
    });
    return;
  }

  // Command: /start
  if (text.startsWith("/start")) {
    const welcomeText = \`سلام \${firstName}! خوش آمدید 👋\\n\\n\` +
      \`این بات با **Cloudflare Workers** اجرا می‌شود و دارای **Telegram Mini App** اختصاصی است.\\n\\n\` +
      \`👇 برای باز کردن مینی‌اپ، روی دکمه زیر کلیک کنید:\`;

    await sendTelegramMessage(chatId, welcomeText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "🚀 باز کردن مینی‌اپ (Mini App)",
              web_app: { url: MINI_APP_URL }
            }
          ],
          [
            {
              text: "💬 پشتیبانی و راهنما",
              callback_data: "help"
            },
            {
              text: "🌐 گیت‌هاب / وب‌سایت",
              url: "https://pages.cloudflare.com"
            }
          ]
        ]
      }
    });
    return;
  }

  // Command: /help
  if (text.startsWith("/help")) {
    await sendTelegramMessage(chatId, \`📖 **راهنمای استفاده از بات و مینی‌اپ:**\\n\\n1️⃣ روی دکمه "باز کردن مینی‌اپ" کلیک کنید.\\n2️⃣ داخل مینی‌اپ می‌توانید محصولات، امتیازها و وظایف را بررسی کنید.\\n3️⃣ پس از هر اقدام، دکمه MainButton تلگرام سفارش را ثبت می‌کند.\`, {
      parse_mode: "Markdown"
    });
    return;
  }

  // Default fallback response
  await sendTelegramMessage(chatId, \`پیام شما دریافت شد: "\${text}"\\nبرای اجرای مینی‌اپ دکمه زیر را لمس کنید.\`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📱 ورود به مینی‌اپ", web_app: { url: MINI_APP_URL } }]
      ]
    }
  });
}

/**
 * Send Message via Telegram Bot API
 */
async function sendTelegramMessage(chatId, text, extra = {}) {
  const payload = {
    chat_id: chatId,
    text: text,
    ...extra
  };

  const res = await fetch(\`\${TELEGRAM_API}/sendMessage\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return await res.json();
}

/**
 * Verify Telegram Mini App initData using Web Crypto API (HMAC-SHA256)
 * Native implementation for Cloudflare Workers without external dependencies!
 */
async function verifyTelegramInitData(initDataString, botToken) {
  const urlParams = new URLSearchParams(initDataString);
  const hash = urlParams.get("hash");

  if (!hash) return false;

  urlParams.delete("hash");

  // Sort keys alphabetically
  const dataCheckArr = [];
  const keys = Array.from(urlParams.keys()).sort();
  for (const key of keys) {
    dataCheckArr.push(\`\${key}=\${urlParams.get(key)}\`);
  }
  const dataCheckString = dataCheckArr.join("\\n");

  const enc = new TextEncoder();

  // 1. HMAC-SHA-256("WebAppData", bot_token)
  const webAppDataKey = await crypto.subtle.importKey(
    "raw",
    enc.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const secretKeyBytes = await crypto.subtle.sign(
    "HMAC",
    webAppDataKey,
    enc.encode(botToken)
  );

  // 2. HMAC-SHA-256(secret_key, data_check_string)
  const secretKey = await crypto.subtle.importKey(
    "raw",
    secretKeyBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const calculatedHashBytes = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    enc.encode(dataCheckString)
  );

  // Convert calculated bytes to hex string
  const calculatedHash = Array.from(new Uint8Array(calculatedHashBytes))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return calculatedHash === hash;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Telegram-Bot-Api-Secret-Token, Authorization"
  };
}

function handleCors() {
  return new Response(null, { headers: corsHeaders() });
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() }
  });
}
`;

export const generateWranglerToml = (
  workerName: string = 'telegram-bot-miniapp',
  compatibilityDate: string = '2024-09-01'
) => `name = "${workerName}"
main = "worker.js"
compatibility_date = "${compatibilityDate}"

# Cloudflare Workers environment variables and bindings
[vars]
ENVIRONMENT = "production"

# Optional: Add KV namespace for storing users, session or cart
# [[kv_namespaces]]
# binding = "BOT_STORAGE"
# id = "your-kv-namespace-id"
`;

export const SAMPLE_PRODUCTS = [
  {
    id: 'prod-stars-100',
    title: '100 Telegram Stars',
    titleFa: '۱۰۰ استار تلگرام (Stars)',
    description: 'Direct in-app Telegram currency',
    descriptionFa: 'ارز درون‌برنامه‌ای تلگرام برای خرید و حمایت از کانال‌ها',
    price: 49000,
    category: 'stars' as const,
    icon: '⭐',
    badge: 'پرفروش',
  },
  {
    id: 'prod-stars-500',
    title: '500 Telegram Stars',
    titleFa: '۵۰۰ استار تلگرام',
    description: 'Popular pack for creators and mini apps',
    descriptionFa: 'بسته محبوب استارز با تخفیف ویژه',
    price: 235000,
    category: 'stars' as const,
    icon: '✨',
    badge: 'تخفیف ۱۰٪',
  },
  {
    id: 'prod-tg-prem-3m',
    title: 'Telegram Premium 3M',
    titleFa: 'تلگرام پریمیوم ۳ ماهه',
    description: 'No ads, 4GB upload, voice-to-text',
    descriptionFa: 'حذف تبلیغات، تبدیل وویس به متن، ایموجی سفارشی',
    price: 690000,
    category: 'telegram-premium' as const,
    icon: '💎',
    badge: 'گارانتی فعال‌سازی',
  },
  {
    id: 'prod-cf-sub',
    title: 'Cloudflare Worker Pro Token',
    titleFa: 'سرویس کلودفلر و پروکسی ورکر',
    description: 'Vless / Worker script deployment access',
    descriptionFa: 'اشتراک ورکر ابری اختصاصی با پینگ سریع و نامحدود',
    price: 180000,
    category: 'vpn' as const,
    icon: '⚡',
    badge: 'ویژه کلاودفلر',
  },
];

export const SAMPLE_TASKS = [
  {
    id: 'task-daily',
    title: 'Daily Check-in',
    titleFa: 'ورود روزانه به مینی‌اپ',
    reward: 25,
    completed: false,
    icon: '📅',
    actionText: 'دریافت ۲۵ امتیاز',
  },
  {
    id: 'task-tg-channel',
    title: 'Join Telegram Channel',
    titleFa: 'عضویت در کانال تلگرام توسعه‌دهندگان',
    reward: 100,
    completed: false,
    icon: '📢',
    actionText: 'عضویت و بررسی',
  },
  {
    id: 'task-invite',
    title: 'Invite 1 Friend',
    titleFa: 'دعوت از ۱ دوست به ربات',
    reward: 150,
    completed: false,
    icon: '👥',
    actionText: 'ارسال لینک دعوت',
  },
  {
    id: 'task-cloudflare',
    title: 'Deploy on Cloudflare',
    titleFa: 'تست وب‌هوک و وریفای امضا',
    reward: 200,
    completed: false,
    icon: '☁️',
    actionText: 'بررسی سلامت ورکر',
  },
];
