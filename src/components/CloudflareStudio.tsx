import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Code, 
  FileCode, 
  Globe, 
  Key, 
  Terminal, 
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { generateWorkerJs, generateWranglerToml } from '../data/cloudflareCode';
import { CloudflareConfig } from '../types';
import rawWorkerJs from '../../worker.js?raw';

interface CloudflareStudioProps {
  config: CloudflareConfig;
  onUpdateConfig: (config: CloudflareConfig) => void;
  currentAppUrl?: string;
}

export const CloudflareStudio: React.FC<CloudflareStudioProps> = ({
  config,
  onUpdateConfig,
  currentAppUrl = window.location.origin
}) => {
  const [activeFile, setActiveFile] = useState<'worker' | 'wrangler' | 'validator'>('worker');
  const [workerMode, setWorkerMode] = useState<'standalone' | 'modular'>('standalone');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // InitData Validator state
  const [testInitData, setTestInitData] = useState<string>(
    `query_id=AAHnFwcEAAAAAOcXBsQW9J2g&user=%7B%22id%22%3A74829103%2C%22first_name%22%3A%22%DA%A9%D8%A7%D8%B1%D8%A8%D8%B1%20%D8%AA%D9%84%DA%AF%D8%B1%D8%A7%D9%85%22%2C%22username%22%3A%22cloudflare_dev%22%7D&auth_date=1725450000&hash=4a926bdf9e7e1a38c9285fbbe6481774b971a81dc3d623293dc2c2c019d3f1d5`
  );
  const [testToken, setTestToken] = useState<string>(config.botToken || '7123456789:AAHnFwcEAAAAAOcXBsQW9J2gSampleToken');
  const [validationResult, setValidationResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    parsedUser?: any;
  }>({
    tested: false,
    valid: false,
    message: '',
  });

  const workerCode = generateWorkerJs(
    config.botToken || 'YOUR_TELEGRAM_BOT_TOKEN',
    config.miniAppUrl || currentAppUrl,
    config.secretToken || 'my_secret_token_123'
  );

  const currentWorkerCode = workerMode === 'standalone' ? rawWorkerJs : workerCode;

  const wranglerConfig = generateWranglerToml(
    'telegram-bot-miniapp',
    '2024-09-01'
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const webhookSetUrl = `https://api.telegram.org/bot${config.botToken || 'YOUR_BOT_TOKEN'}/setWebhook?url=${encodeURIComponent(config.workerUrl || 'https://my-worker.workers.dev')}${config.secretToken ? `&secret_token=${config.secretToken}` : ''}`;
  const webhookInfoUrl = `https://api.telegram.org/bot${config.botToken || 'YOUR_BOT_TOKEN'}/getWebhookInfo`;

  // Browser-based HMAC validation test using Web Crypto API
  const runValidationTest = async () => {
    try {
      const urlParams = new URLSearchParams(testInitData);
      const hash = urlParams.get('hash');
      const userParam = urlParams.get('user');

      let parsedUser = null;
      if (userParam) {
        try {
          parsedUser = JSON.parse(userParam);
        } catch (_) {}
      }

      if (!hash) {
        setValidationResult({
          tested: true,
          valid: false,
          message: 'پارامتر hash در رشته initData یافت نشد.',
          parsedUser
        });
        return;
      }

      urlParams.delete('hash');
      const keys = Array.from(urlParams.keys()).sort();
      const dataCheckArr = keys.map(k => `${k}=${urlParams.get(k)}`);
      const dataCheckString = dataCheckArr.join('\n');

      const enc = new TextEncoder();
      const webAppDataKey = await crypto.subtle.importKey(
        'raw',
        enc.encode('WebAppData'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const secretKeyBytes = await crypto.subtle.sign(
        'HMAC',
        webAppDataKey,
        enc.encode(testToken)
      );

      const secretKey = await crypto.subtle.importKey(
        'raw',
        secretKeyBytes,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const calculatedHashBytes = await crypto.subtle.sign(
        'HMAC',
        secretKey,
        enc.encode(dataCheckString)
      );

      const calculatedHash = Array.from(new Uint8Array(calculatedHashBytes))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      const isValid = calculatedHash.toLowerCase() === hash.toLowerCase();

      setValidationResult({
        tested: true,
        valid: isValid,
        message: isValid
          ? 'امضای هش با توکن مطابقت دارد! داده کاملاً معتبر است.'
          : `هش محاسبه‌شده با رشته ارسالی همخوانی ندارد. (تست با توکن فرضی: هش ${calculatedHash.substring(0, 10)}...)`,
        parsedUser
      });
    } catch (err: any) {
      setValidationResult({
        tested: true,
        valid: false,
        message: 'خطا در محاسبه امضا: ' + err.message
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      {/* Top Header Card */}
      <div className="p-5 bg-gradient-to-r from-orange-500/10 via-sky-500/10 to-indigo-500/10 rounded-3xl border border-orange-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-white">
              کد آماده Cloudflare Workers برای بات تلگرام
            </h2>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            سورس کامل JavaScript (ES Modules) بدون نیاز به سرور (Serverless) برای اجرا روی پلتفرم قدرتمند کلودفلر، همراه با وب‌هوک و امنیت HMAC-SHA256.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-use-current-url"
            onClick={() => onUpdateConfig({ ...config, miniAppUrl: currentAppUrl })}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>تنظیم آدرس فعلی پیش‌نمایش</span>
          </button>
        </div>
      </div>

      {/* Configuration Input Fields */}
      <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>توکن ربات تلگرام (Bot Token):</span>
          </label>
          <input
            id="cfg-bot-token"
            type="text"
            value={config.botToken}
            onChange={e => onUpdateConfig({ ...config, botToken: e.target.value })}
            placeholder="مثلا 7123456789:AAHn..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>آدرس هاست مینی‌اپ (Mini App URL):</span>
          </label>
          <input
            id="cfg-miniapp-url"
            type="text"
            value={config.miniAppUrl}
            onChange={e => onUpdateConfig({ ...config, miniAppUrl: e.target.value })}
            placeholder="https://my-miniapp.pages.dev"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1 block flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>آدرس ورکر کلودفلر (Worker URL):</span>
          </label>
          <input
            id="cfg-worker-url"
            type="text"
            value={config.workerUrl}
            onChange={e => onUpdateConfig({ ...config, workerUrl: e.target.value })}
            placeholder="https://telegram-bot.sub.workers.dev"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Alert Box for resolving intermediate landing page issue */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <div className="font-bold text-sm text-amber-300">
            راهنمای حذف صفحه اول واسط (با دکمه «ورود به مینی‌اپ»):
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            اگر در تلگرام هنگام لمس دکمه ربات هنوز صفحه واسط با نوشته <span className="text-amber-200 font-mono bg-slate-900/80 px-1 py-0.5 rounded">«سرویس ارتباطی وب‌هوک و ثبت رزرو...»</span> را می‌بینید، دلیل آن این است که کد جدید هنوز در پنل Cloudflare شما Save & Deploy نشده است.
          </p>
          <div className="pt-1 text-slate-300 leading-relaxed text-xs">
            <strong className="text-white">روش حل در ۲ قدم ساده:</strong>
            <ol className="list-decimal list-inside space-y-0.5 mt-1 text-slate-300">
              <li>دکمه <strong className="text-sky-300">«کپی کد ورکر جدید»</strong> در زیر را بزنید.</li>
              <li>وارد پنل کلودفلر خود شوید (Workers & Pages &gt; ورکر خانه برزک &gt; <strong className="text-amber-300">Edit Code</strong>)، متن قبلی را پاک کرده، کد جدید را Paste کنید و دکمه آبی <strong className="text-emerald-400">Save and Deploy</strong> را بزنید. مینی‌اپ مستقیماً و بلافاصله باز خواهد شد!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Code Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap gap-2 items-center">
          <button
            id="tab-view-worker-js"
            onClick={() => setActiveFile('worker')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeFile === 'worker'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>worker.js (نسخه بدون صفحه واسط)</span>
          </button>
          <button
            id="tab-view-wrangler-toml"
            onClick={() => setActiveFile('wrangler')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeFile === 'wrangler'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>wrangler.toml (کانفیگ CLI)</span>
          </button>
          <button
            id="tab-view-validator"
            onClick={() => setActiveFile('validator')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${
              activeFile === 'validator'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تست امنیت و امضای HMAC-SHA256</span>
          </button>
        </div>

        {activeFile !== 'validator' && (
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-code"
              onClick={() =>
                copyToClipboard(
                  activeFile === 'worker' ? currentWorkerCode : wranglerConfig,
                  activeFile
                )
              }
              className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold border border-orange-500 flex items-center gap-1.5 transition shadow"
            >
              {copiedKey === activeFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300">کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کپی کد ورکر جدید</span>
                </>
              )}
            </button>
            <button
              id="btn-download-code"
              onClick={() =>
                downloadFile(
                  activeFile === 'worker' ? 'worker.js' : 'wrangler.toml',
                  activeFile === 'worker' ? currentWorkerCode : wranglerConfig
                )
              }
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود فایل</span>
            </button>
          </div>
        )}
      </div>

      {/* Code Display Area */}
      {activeFile === 'worker' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono text-slate-300 mr-2">worker.js</span>
            </div>
            <span className="text-[11px]">JavaScript • ES Modules • Cloudflare Workers API</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
            <code>{currentWorkerCode}</code>
          </pre>
        </div>
      )}

      {activeFile === 'wrangler' && (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1117] overflow-hidden shadow-2xl">
          <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono text-slate-300 mr-2">wrangler.toml</span>
            </div>
            <span className="text-[11px]">TOML • Cloudflare CLI Configuration</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{wranglerConfig}</code>
          </pre>
        </div>
      )}

      {/* Security & HMAC Validator Tab */}
      {activeFile === 'validator' && (
        <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>اعتبارسنجی زنده داده‌های تلگرام (HMAC-SHA256 InitData Validator)</span>
            </h3>
            <p className="text-slate-300 text-xs mt-1">
              مهم‌ترین بخش بک‌اند مینی‌اپ: بررسی امضای هش تلگرام با Web Crypto API بدون نصب کتابخانه‌های سنگین در کلودفلر.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              رشته initData تلگرام (از Telegram.WebApp.initData):
            </label>
            <textarea
              rows={3}
              value={testInitData}
              onChange={e => setTestInitData(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-slate-300 font-semibold block">
              توکن ربات جهت بررسی امضا (Bot Token):
            </label>
            <input
              type="text"
              value={testToken}
              onChange={e => setTestToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            id="btn-run-validation-test"
            onClick={runValidationTest}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center gap-2 transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>محاسبه و اعتبارسنجی امضا</span>
          </button>

          {validationResult.tested && (
            <div className={`p-4 rounded-xl border ${
              validationResult.valid
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {validationResult.valid ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>نتیجه: امضا معتبر است! (Authorized)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>اطلاعات اعتبارسنجی:</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs opacity-90">{validationResult.message}</p>
              {validationResult.parsedUser && (
                <div className="mt-2 pt-2 border-t border-white/10 font-mono text-[11px]">
                  کاربر استخراج‌شده: ID: {validationResult.parsedUser.id} • {validationResult.parsedUser.first_name} (@{validationResult.parsedUser.username})
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Webhook Configuration Quick Setup Helper */}
      <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400" />
          <span>لینک تنظیم فوری وب‌هوک تلگرام (setWebhook Link):</span>
        </h3>
        <p className="text-slate-400">
          پس از پابلیش کردن ورکر در کلودفلر، این آدرس را در مرورگر باز کنید یا با cURL فراخوانی نمایید تا تلگرام تمام پیام‌ها را به ورکر شما بفرستد:
        </p>
        <div className="p-2.5 bg-black/50 rounded-xl border border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="font-mono text-slate-300 text-[11px] truncate select-all">
            {webhookSetUrl}
          </span>
          <button
            id="btn-copy-webhook-url"
            onClick={() => copyToClipboard(webhookSetUrl, 'webhook-url')}
            className="shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-[11px] border border-slate-700 flex items-center gap-1"
          >
            {copiedKey === 'webhook-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>کپی لینک Webhook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
