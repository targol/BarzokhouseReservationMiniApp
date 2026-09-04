/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  Terminal, 
  BookOpen, 
  Sparkles, 
  Cloud, 
  Zap, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Code2,
  RefreshCw
} from 'lucide-react';
import { TelegramFrame } from './components/TelegramFrame';
import { CloudflareStudio } from './components/CloudflareStudio';
import { DeploymentGuide } from './components/DeploymentGuide';
import { TelegramUser, CloudflareConfig } from './types';
import { DEFAULT_MOCK_USER } from './lib/telegramMock';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'cloudflare' | 'guide'>('simulator');
  const [user, setUser] = useState<TelegramUser>(DEFAULT_MOCK_USER);

  const [config, setConfig] = useState<CloudflareConfig>({
    botToken: '7123456789:AAHnFwcEAAAAAOcXBsQW9J2gSampleToken',
    workerUrl: 'https://telegram-bot-miniapp.subdomain.workers.dev',
    miniAppUrl: typeof window !== 'undefined' ? window.location.origin : 'https://my-miniapp.pages.dev',
    secretToken: 'cf_telegram_secret_998',
    botUsername: 'CloudflareMiniappBot'
  });

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <div className="w-10 h-10 rounded-2xl bg-[#0088cc] flex items-center justify-center text-white shadow-lg shadow-[#0088cc]/20 font-black text-xl">
                <Send className="w-5 h-5 -rotate-45 ml-0.5" />
              </div>
              <div className="w-5 h-5 -mr-2 -mt-4 rounded-lg bg-[#f38020] border-2 border-[#0b0f17] flex items-center justify-center text-[10px] text-white font-bold shadow">
                <Cloud className="w-3 h-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight leading-tight">
                  Telegram Mini App & Cloudflare Studio
                </h1>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium border border-sky-400/20">
                  JavaScript (JS)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                طراحی مینی‌اپ تلگرام + بک‌اند سرورلس کلودفلر ورکرز
              </p>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            <button
              id="main-tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'simulator'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>شبیه‌ساز مینی‌اپ</span>
            </button>

            <button
              id="main-tab-cloudflare"
              onClick={() => setActiveTab('cloudflare')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'cloudflare'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>کد Cloudflare Workers</span>
            </button>

            <button
              id="main-tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'guide'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>راهنمای استقرار</span>
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SDK تلگرام متصل
            </span>
          </div>

        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        {activeTab === 'simulator' && (
          <TelegramFrame
            user={user}
            onUpdateUser={setUser}
            botUsername={config.botUsername}
            miniAppUrl={config.miniAppUrl}
          />
        )}

        {activeTab === 'cloudflare' && (
          <CloudflareStudio
            config={config}
            onUpdateConfig={setConfig}
            currentAppUrl={typeof window !== 'undefined' ? window.location.origin : ''}
          />
        )}

        {activeTab === 'guide' && (
          <DeploymentGuide />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-[#080c14] py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Telegram Mini App (TMA) & Cloudflare Workers Bot Studio • پشتیبانی از زبان جاوااسکریپت و وب کرایپتو (Web Crypto API)</span>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Telegram WebApp SDK 7.10+</span>
            <span>•</span>
            <span>Cloudflare Pages & Workers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

