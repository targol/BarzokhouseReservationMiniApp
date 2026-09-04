import React from 'react';
import { 
  Bot, 
  Cloud, 
  Globe, 
  Terminal, 
  CheckCircle2, 
  ArrowLeft, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Code2, 
  Sparkles,
  Zap
} from 'lucide-react';

export const DeploymentGuide: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto p-3 sm:p-6 text-slate-100">
      {/* Intro Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>آموزش گام‌به‌گام به زبان ساده و روان</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          راه‌اندازی کامل بات و مینی‌اپ تلگرام روی Cloudflare
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          کلودفلر به شما امکان می‌دهد بدون نیاز به خرید سرور مجازی (VPS) یا درگیر شدن با فیلترینگ، بک‌اند ربات خود را با Workers و فرانت‌اند مینی‌اپ را با Pages به‌صورت رایگان و بسیار سریع اجرا کنید.
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span>معماری و چرخه داده (Architecture Workflow):</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Box 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-lg">
              📱
            </div>
            <h4 className="font-bold text-white">۱. کلاینت تلگرام</h4>
            <p className="text-[11px] text-slate-400">
              کاربر دستور /start را می‌زند یا مینی‌اپ را باز می‌کند.
            </p>
          </div>

          {/* Box 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-orange-500/30 space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg">
              ⚡
            </div>
            <h4 className="font-bold text-white">۲. Cloudflare Workers</h4>
            <p className="text-[11px] text-slate-400">
              کد جاوااسکریپت (worker.js) پیام وب‌هوک را می‌گیرد و دکمه Mini App را برمی‌گرداند.
            </p>
          </div>

          {/* Box 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg">
              🌐
            </div>
            <h4 className="font-bold text-white">۳. فرانت‌اند مینی‌اپ (Pages)</h4>
            <p className="text-[11px] text-slate-400">
              فایل‌های HTML/JS/CSS روی Cloudflare Pages بارگذاری و درون تلگرام رندر می‌شوند.
            </p>
          </div>

          {/* Box 4 */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-2 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
              🔒
            </div>
            <h4 className="font-bold text-white">۴. اعتبارسنجی امنیتی</h4>
            <p className="text-[11px] text-slate-400">
              ورکر با امضای HMAC-SHA256 هویت کاربر و داده‌های سفارش را تایید می‌کند.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Steps Guide */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white font-black flex items-center justify-center text-sm shadow">
              ۱
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ساخت ربات در تلگرام با @BotFather</h3>
              <p className="text-xs text-slate-400">دریافت توکن و تنظیمات مینی‌اپ</p>
            </div>
          </div>
          <div className="pr-11 space-y-2 text-xs text-slate-300 leading-relaxed">
            <ol className="list-decimal list-inside space-y-1.5 marker:text-sky-400">
              <li>
                در تلگرام به آیدی <code className="text-sky-300 bg-black/40 px-1.5 py-0.5 rounded">@BotFather</code> پیام دهید.
              </li>
              <li>
                دستور <code className="text-sky-300 bg-black/40 px-1.5 py-0.5 rounded">/newbot</code> را بفرستید، سپس نام نمایشی و نام کاربری (که با <code className="text-sky-300">bot</code> تمام می‌شود) را وارد کنید.
              </li>
              <li>
                توکن ارائه‌شده (شبیه به <code className="text-amber-400 bg-black/40 px-1.5 py-0.5 rounded font-mono">123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11</code>) را کپی کنید.
              </li>
              <li>
                برای فعال‌سازی دکمه مینی‌اپ کنار کادر چت، دستور <code className="text-sky-300 bg-black/40 px-1.5 py-0.5 rounded">/setmenubutton</code> را ارسال کنید و آدرس اینترنتی مینی‌اپ خود را بدهید.
              </li>
            </ol>
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow">
              ۲
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">اجرای بک‌اند ربات روی Cloudflare Workers (با JS)</h3>
              <p className="text-xs text-slate-400">کدنویسی سرورلس در چند ثانیه بدون نیاز به سرور</p>
            </div>
          </div>
          <div className="pr-11 space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>دو روش ساده برای قرار دادن کد در کلودفلر وجود دارد:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-sky-400 flex items-center gap-1.5">
                  <span>روش ۱: داشبورد وب کلودفلر (بدون کدنویسی محلی)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>به سایت <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">dash.cloudflare.com</a> بروید.</li>
                  <li>وارد منوی <strong>Workers & Pages</strong> شده و دکمه <strong>Create Application</strong> را بزنید.</li>
                  <li>روی <strong>Create Worker</strong> کلیک کرده و نامی مثل <code className="text-amber-300">telegram-bot</code> انتخاب کنید.</li>
                  <li>دکمه <strong>Edit Code</strong> را بزنید و محتویات تب <strong>worker.js</strong> برنامه ما را داخل آن پیست و <strong>Deploy</strong> کنید!</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-orange-400 flex items-center gap-1.5">
                  <span>روش ۲: با ترمینال و Wrangler CLI</span>
                </h4>
                <div className="space-y-1 text-[11px] font-mono text-slate-300">
                  <div className="bg-black/60 p-2 rounded-lg">
                    <code>npx wrangler login</code>
                  </div>
                  <div className="bg-black/60 p-2 rounded-lg">
                    <code>npx wrangler deploy</code>
                  </div>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">
                    تنها با همین دو دستور، ورکر شما کامپایل و در شبکه جهانی کلودفلر مستقر می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
              ۳
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">میزبانی مینی‌اپ روی Cloudflare Pages (رایگان با SSL)</h3>
              <p className="text-xs text-slate-400">هاست فرانت‌اند ری‌اکت و HTML</p>
            </div>
          </div>
          <div className="pr-11 space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              تلگرام نیازمند آن است که آدرس مینی‌اپ دارای <strong>HTTPS</strong> باشد. Cloudflare Pages به طور خودکار به شما یک دامنه رایگان به صورت <code className="text-indigo-400 bg-black/40 px-1.5 py-0.5 rounded">https://your-app.pages.dev</code> با گواهینامه SSL اختصاص می‌دهد.
            </p>
            <div className="bg-black/40 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200">
              # ساخت بیلد پروژه<br />
              npm run build<br /><br />
              # دیپلوی پوشه dist در کلودفلر پیجز<br />
              npx wrangler pages deploy dist --project-name=my-telegram-miniapp
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-sm shadow">
              ۴
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">تنظیم وب‌هوک تلگرام (اتصال ورکر به بات)</h3>
              <p className="text-xs text-slate-400">هدایت تمام آپدیت‌های تلگرام به کلودفلر</p>
            </div>
          </div>
          <div className="pr-11 space-y-2 text-xs text-slate-300 leading-relaxed">
            <p>
              تنها کاری که باقی مانده این است که به تلگرام اعلام کنید پیام‌ها را به آدرس Cloudflare Worker شما بفرستد. کافی است این آدرس را در مرورگر باز کنید:
            </p>
            <div className="bg-black/40 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 break-all select-all">
              https://api.telegram.org/bot&lt;YOUR_BOT_TOKEN&gt;/setWebhook?url=https://&lt;YOUR_WORKER&gt;.workers.dev
            </div>
            <p className="text-slate-400 text-[11px]">
              پاسخ دریافتی باید <code className="text-emerald-400 font-mono">{"{\"ok\":true,\"result\":true,\"description\":\"Webhook was set\"}"}</code> باشد.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
