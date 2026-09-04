import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Battery, 
  ChevronRight, 
  MoreVertical, 
  X, 
  Send, 
  Moon, 
  Sun, 
  Smartphone, 
  MessageSquare, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  Shield,
  Loader2
} from 'lucide-react';
import { MiniAppView } from './MiniAppView';
import { TelegramBridge } from '../lib/telegramMock';
import { TelegramUser, TelegramWebAppBridge, BotChatMessage } from '../types';

interface TelegramFrameProps {
  user: TelegramUser;
  onUpdateUser: (user: TelegramUser) => void;
  botUsername?: string;
  miniAppUrl?: string;
}

export const TelegramFrame: React.FC<TelegramFrameProps> = ({
  user,
  onUpdateUser,
  botUsername = 'CloudflareMiniappBot',
  miniAppUrl = 'https://my-miniapp.pages.dev'
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'chat' | 'miniapp'>('miniapp');
  const [chatInput, setChatInput] = useState<string>('');
  
  // Telegram WebApp bridge state
  const [bridge, setBridge] = useState<TelegramWebAppBridge>(() => 
    TelegramBridge.getBridge(user, isDarkMode)
  );

  const [mainButtonState, setMainButtonState] = useState({
    text: 'ادامه',
    color: '#5288c1',
    textColor: '#ffffff',
    isVisible: false,
    isActive: true,
    isProgressVisible: false,
  });

  const [backButtonVisible, setBackButtonVisible] = useState(false);

  // Chat messages simulation
  const [messages, setMessages] = useState<BotChatMessage[]>([
    {
      id: '1',
      sender: 'user',
      text: '/start',
      time: '12:35'
    },
    {
      id: '2',
      sender: 'bot',
      text: `سلام ${user.first_name}! خوش آمدید 👋\n\nاین بات با **Cloudflare Workers** اجرا می‌شود و دارای **Telegram Mini App** اختصاصی است.\n\n👇 برای باز کردن مینی‌اپ، روی دکمه زیر کلیک کنید:`,
      time: '12:35',
      hasMiniAppButton: true,
      buttonText: '🚀 باز کردن مینی‌اپ (Mini App)'
    }
  ]);

  // Re-sync bridge on dark mode or user changes
  useEffect(() => {
    const newBridge = TelegramBridge.getBridge(user, isDarkMode);
    setBridge(newBridge);

    const unsubscribe = TelegramBridge.addEventListener((event, data) => {
      if (event === 'mainButtonChange') {
        setMainButtonState({ ...data });
      } else if (event === 'backButtonChange') {
        setBackButtonVisible(data.isVisible);
      } else if (event === 'close') {
        setActiveView('chat');
      }
    });

    return () => unsubscribe();
  }, [user, isDarkMode]);

  const handleSendMessage = (textToSend?: string) => {
    const msg = textToSend || chatInput;
    if (!msg.trim()) return;

    const userMsg: BotChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: msg,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate Cloudflare Worker Bot response
    setTimeout(() => {
      let replyText = `پیام دریافت شد: "${msg}"`;
      let hasButton = false;

      if (msg === '/start' || msg.includes('start')) {
        replyText = `سلام ${user.first_name}! ربات کلودفلر آماده ارائه خدمات مینی‌اپ است.`;
        hasButton = true;
      } else if (msg === '/help') {
        replyText = 'راهنما: شما می‌توانید از طریق دکمه زیر وارد مینی‌اپ شوید و محصولات یا تسک‌های کلودفلر را مدیریت کنید.';
        hasButton = true;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          hasMiniAppButton: hasButton,
          buttonText: '🚀 باز کردن مینی‌اپ (Mini App)'
        }
      ]);
    }, 600);
  };

  // When data is sent back from Mini App via sendData()
  const handleMiniAppDataReceived = (data: any) => {
    const formattedData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    
    // Switch to chat view to show bot receipt
    setActiveView('chat');

    const botReceipt: BotChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: `✅ **اطلاعات مینی‌اپ دریافت شد!**\n\n📦 داده ارسالی از WebApp:\n\`\`\`json\n${formattedData}\n\`\`\`\nبا تشکر از ثبت شما! سفارش در صف پردازش قرار گرفت.`,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      rawData: data
    };

    setMessages(prev => [...prev, botReceipt]);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4">
      {/* Phone Simulator Frame */}
      <div className="w-full max-w-[380px] h-[720px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 relative flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
        </div>

        {/* Top iOS/Android Status Bar */}
        <div className="h-7 w-full flex items-center justify-between px-5 text-[11px] font-semibold text-slate-300 select-none z-40">
          <span>12:45</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Inner Screen Canvas */}
        <div className={`flex-1 rounded-[32px] overflow-hidden flex flex-col relative ${
          isDarkMode ? 'bg-[#17212b] text-white' : 'bg-[#f4f4f5] text-slate-900'
        }`}>

          {/* TELEGRAM HEADER */}
          <div className={`px-3 py-2 border-b flex items-center justify-between z-30 transition-colors ${
            isDarkMode 
              ? 'bg-[#17212b] border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center gap-1.5">
              {activeView === 'miniapp' && (
                <button
                  id="btn-tg-close-miniapp"
                  onClick={() => setActiveView('chat')}
                  className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
                  title="بستن مینی‌اپ"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {activeView === 'chat' && (
                <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-xs font-bold">
                  🤖
                </div>
              )}
              <div className="text-right">
                <div className="font-bold text-xs flex items-center gap-1">
                  <span>{activeView === 'miniapp' ? 'Cloudflare Mini App' : botUsername}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeView === 'miniapp' ? `@${botUsername}` : 'bot • online'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                title="تغییر تم تلگرام (تاریک/روشن)"
              >
                {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              </button>
              <button className="p-1 rounded-full text-slate-400">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* VIEW 1: TELEGRAM BOT CHAT SCREEN */}
          {activeView === 'chat' && (
            <div className="flex-1 flex flex-col justify-between bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: isDarkMode 
                  ? 'radial-gradient(ellipse at 50% 50%, #1e2c3a 0%, #0e1621 100%)' 
                  : 'radial-gradient(ellipse at 50% 50%, #e2e8f0 0%, #cbd5e1 100%)'
              }}
            >
              {/* Messages list */}
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="text-center">
                  <span className="text-[10px] bg-black/30 text-slate-300 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    امروز
                  </span>
                </div>

                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : isDarkMode
                          ? 'bg-[#182533] text-slate-100 border border-slate-700/50 rounded-bl-none'
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      
                      {msg.hasMiniAppButton && (
                        <div className="mt-2.5 pt-2 border-t border-white/10">
                          <button
                            id="btn-chat-launch-miniapp"
                            onClick={() => setActiveView('miniapp')}
                            className="w-full py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{msg.buttonText || 'باز کردن مینی‌اپ'}</span>
                          </button>
                        </div>
                      )}

                      <div className="text-[9px] text-right mt-1 opacity-60">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className={`p-2 border-t flex items-center gap-1.5 ${
                isDarkMode ? 'bg-[#17212b] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="پیام یا دستور (مثلا /start)..."
                  className={`flex-1 text-xs px-3 py-2 rounded-full border focus:outline-none ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-100 border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button
                  id="btn-chat-send"
                  onClick={() => handleSendMessage()}
                  className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-400 active:scale-95 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: ACTIVE MINI APP SCREEN */}
          {activeView === 'miniapp' && (
            <div className="flex-1 flex flex-col relative overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <MiniAppView
                  bridge={bridge}
                  user={user}
                  onSendData={handleMiniAppDataReceived}
                />
              </div>

              {/* Telegram Floating MainButton Bar (Native TMA MainButton) */}
              {mainButtonState.isVisible && (
                <div className="absolute bottom-2 left-3 right-3 z-40 animate-in slide-in-from-bottom-3 duration-200">
                  <button
                    id="telegram-main-button"
                    disabled={!mainButtonState.isActive || mainButtonState.isProgressVisible}
                    onClick={() => TelegramBridge.triggerMainButtonClick()}
                    style={{
                      backgroundColor: mainButtonState.color || '#5288c1',
                      color: mainButtonState.textColor || '#ffffff'
                    }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition disabled:opacity-50"
                  >
                    {mainButtonState.isProgressVisible ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>در حال پردازش...</span>
                      </>
                    ) : (
                      <span>{mainButtonState.text}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 w-full flex items-center justify-center">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>

      {/* Simulator Control Panel (Beside the frame) */}
      <div className="w-full max-w-sm space-y-4">
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-400" />
              <span>کنترل شبیه‌ساز تلگرام</span>
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Mock Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="switch-to-miniapp"
              onClick={() => setActiveView('miniapp')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeView === 'miniapp'
                  ? 'bg-sky-600 border-sky-500 text-white shadow-lg'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>نمای مینی‌اپ</span>
            </button>
            <button
              id="switch-to-chat"
              onClick={() => setActiveView('chat')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                activeView === 'chat'
                  ? 'bg-sky-600 border-sky-500 text-white shadow-lg'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>چت با ربات</span>
            </button>
          </div>

          {/* Quick Mock User Modifier */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] block font-medium">
              مشخصات کاربر تست تلگرام (User Profile):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={user.first_name}
                onChange={e => onUpdateUser({ ...user, first_name: e.target.value })}
                placeholder="نام کاربر"
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-[11px]"
              />
              <input
                type="text"
                value={user.username || ''}
                onChange={e => onUpdateUser({ ...user, username: e.target.value })}
                placeholder="نام کاربری بدون @"
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-[11px]"
              />
            </div>
          </div>

          <div className="p-2.5 bg-sky-950/40 border border-sky-500/20 rounded-xl text-[11px] text-sky-300 leading-relaxed">
            💡 <strong>راهنما:</strong> در حالت چت، می‌توانید دستور <code className="bg-slate-800 px-1 rounded">/start</code> بفرستید تا پیام استارت ربات کلودفلر و دکمه باز کردن مینی‌اپ شبیه‌سازی شود.
          </div>
        </div>
      </div>
    </div>
  );
};
