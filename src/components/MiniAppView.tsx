import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Code2, 
  User, 
  CheckCircle2, 
  Vibrate, 
  Database, 
  Send, 
  Check, 
  Plus, 
  Minus, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { SAMPLE_PRODUCTS, SAMPLE_TASKS } from '../data/cloudflareCode';
import { TelegramBridge } from '../lib/telegramMock';
import { TelegramUser, TelegramWebAppBridge } from '../types';

interface MiniAppViewProps {
  bridge: TelegramWebAppBridge;
  user: TelegramUser;
  onSendData?: (data: any) => void;
  lang?: 'fa' | 'en';
}

export const MiniAppView: React.FC<MiniAppViewProps> = ({
  bridge,
  user,
  onSendData,
  lang = 'fa'
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'tasks' | 'api' | 'profile'>('shop');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [points, setPoints] = useState<number>(320);
  const [tasks, setTasks] = useState(SAMPLE_TASKS);
  const [hapticStatus, setHapticStatus] = useState<string>('');
  const [cloudStorageStatus, setCloudStorageStatus] = useState<string>('آماده بارگذاری اطلاعات...');
  const [storageInput, setStorageInput] = useState<string>('مقدار ذخیره‌شده آزمایشی');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart total calculations
  const totalCartItems: number = (Object.values(cart) as number[]).reduce((sum, q) => sum + q, 0);
  const totalCartPrice: number = (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
    const product = SAMPLE_PRODUCTS.find(p => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);

  // Sync Telegram MainButton with Cart state
  useEffect(() => {
    if (!bridge.MainButton) return;

    if (totalCartItems > 0 && activeTab === 'shop') {
      const formattedPrice = new Intl.NumberFormat('fa-IR').format(totalCartPrice);
      bridge.MainButton.setText(`ثبت نهایی سفارش (${formattedPrice} تومان) 💳`);
      bridge.MainButton.show();
      bridge.MainButton.enable();

      const handleMainButtonClick = () => {
        bridge.HapticFeedback.notificationOccurred('success');
        bridge.MainButton.showProgress();

        const orderData = {
          action: 'order_submitted',
          orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
          userId: user.id,
          username: user.username,
          items: Object.entries(cart).map(([id, qty]) => {
            const item = SAMPLE_PRODUCTS.find(p => p.id === id);
            return { id, title: item?.titleFa, qty, price: item?.price };
          }),
          totalPrice: totalCartPrice,
          timestamp: new Date().toISOString()
        };

        setTimeout(() => {
          bridge.MainButton.hideProgress();
          bridge.MainButton.hide();
          setCart({});
          showToast('سفارش شما با موفقیت به ربات ارسال شد!');
          
          if (onSendData) {
            onSendData(orderData);
          }
          bridge.sendData(JSON.stringify(orderData));
        }, 1200);
      };

      bridge.MainButton.onClick(handleMainButtonClick);
      return () => {
        bridge.MainButton.offClick(handleMainButtonClick);
      };
    } else {
      bridge.MainButton.hide();
    }
  }, [totalCartItems, totalCartPrice, activeTab, cart, bridge, user, onSendData]);

  const updateQuantity = (id: string, delta: number) => {
    bridge.HapticFeedback.selectionChanged();
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleClaimTask = (taskId: string, reward: number) => {
    bridge.HapticFeedback.notificationOccurred('success');
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: true } : t))
    );
    setPoints(prev => prev + reward);
    showToast(`🎉 تبریک! ${reward} امتیاز به حساب شما افزوده شد.`);
  };

  const testHaptic = (style: 'light' | 'medium' | 'heavy' | 'success' | 'error') => {
    if (style === 'success' || style === 'error') {
      bridge.HapticFeedback.notificationOccurred(style);
      setHapticStatus(`اعلان لمسی: ${style}`);
    } else {
      bridge.HapticFeedback.impactOccurred(style);
      setHapticStatus(`ضربه لمسی: ${style}`);
    }
  };

  const testAlert = () => {
    bridge.showAlert('این یک پیام پاپ‌آپ رسمی تلگرام است (Telegram.WebApp.showAlert)!');
    showToast('پیام اعلان تست شد');
  };

  const testConfirm = () => {
    bridge.showConfirm('آیا می‌خواهید تغییرات در فضای ابری تلگرام ذخیره شود؟', (confirmed) => {
      showToast(confirmed ? 'کاربر تایید کرد ✅' : 'کاربر لغو کرد ❌');
    });
  };

  const handleSaveToCloud = () => {
    bridge.CloudStorage.setItem('custom_note', storageInput, (err, success) => {
      if (success) {
        setCloudStorageStatus(`داده با موفقیت در Telegram CloudStorage ذخیره شد: "${storageInput}"`);
        bridge.HapticFeedback.notificationOccurred('success');
      } else {
        setCloudStorageStatus('خطا در ذخیره سازی ابری');
      }
    });
  };

  const handleLoadFromCloud = () => {
    bridge.CloudStorage.getItem('custom_note', (err, val) => {
      if (val) {
        setCloudStorageStatus(`مقدار بازخوانی‌شده از CloudStorage: "${val}"`);
        setStorageInput(val);
        bridge.HapticFeedback.impactOccurred('medium');
      } else {
        setCloudStorageStatus('مقداری یافت نشد، ابتدا دکمه ذخیره را بزنید.');
      }
    });
  };

  return (
    <div id="telegram-miniapp-root" className="min-h-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] flex flex-col font-sans transition-colors duration-200 select-none pb-20">
      {/* Mini App Top Header Bar */}
      <div className="bg-[var(--tg-theme-secondary-bg-color)] px-4 py-3 border-b border-slate-700/40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow overflow-hidden border border-white/20">
            {user.photo_url ? (
              <img src={user.photo_url} alt="User" className="w-full h-full object-cover" />
            ) : (
              user.first_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm leading-tight text-white">
                {user.first_name} {user.last_name || ''}
              </span>
              {user.is_premium && (
                <span className="bg-sky-500/20 text-sky-400 text-[10px] px-1.5 py-0.5 rounded-full font-medium border border-sky-400/30">
                  Premium
                </span>
              )}
            </div>
            <div className="text-[11px] text-[var(--tg-theme-hint-color)]">
              @{user.username || 'user'} • ID: {user.id}
            </div>
          </div>
        </div>

        {/* Stars / Points pill */}
        <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{points} امتیاز</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs (Telegram native segmented bar) */}
      <div className="p-2 bg-[var(--tg-theme-secondary-bg-color)]/60 border-b border-slate-700/30">
        <div className="grid grid-cols-4 gap-1 p-1 bg-black/20 rounded-xl">
          <button
            id="tab-btn-shop"
            onClick={() => {
              bridge.HapticFeedback.selectionChanged();
              setActiveTab('shop');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'shop'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>فروشگاه</span>
          </button>
          <button
            id="tab-btn-tasks"
            onClick={() => {
              bridge.HapticFeedback.selectionChanged();
              setActiveTab('tasks');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'tasks'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>جوایز</span>
          </button>
          <button
            id="tab-btn-api"
            onClick={() => {
              bridge.HapticFeedback.selectionChanged();
              setActiveTab('api');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SDK تلگرام</span>
          </button>
          <button
            id="tab-btn-profile"
            onClick={() => {
              bridge.HapticFeedback.selectionChanged();
              setActiveTab('profile');
            }}
            className={`py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>پروفایل</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-4">
        {/* Toast Alert Notification */}
        {toastMessage && (
          <div className="p-3 bg-sky-500/90 text-white text-xs font-medium rounded-xl flex items-center gap-2 shadow-lg animate-in fade-in duration-200 backdrop-blur-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. STORE / SHOP TAB */}
        {activeTab === 'shop' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--tg-theme-hint-color)]">
                محصولات و بسته‌های تلگرام
              </span>
              <span className="text-[11px] text-sky-400 flex items-center gap-1">
                <Zap className="w-3 h-3" /> پشتیبانی از WebApp Payment
              </span>
            </div>

            <div className="space-y-2.5">
              {SAMPLE_PRODUCTS.map((prod) => {
                const qty = cart[prod.id] || 0;
                return (
                  <div
                    key={prod.id}
                    id={`product-card-${prod.id}`}
                    className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 flex items-center justify-between gap-3 shadow-sm hover:border-slate-600/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-2xl shadow-inner shrink-0">
                        {prod.icon}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-white">{prod.titleFa}</h4>
                          {prod.badge && (
                            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded font-normal">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--tg-theme-hint-color)] line-clamp-1">
                          {prod.descriptionFa}
                        </p>
                        <div className="text-xs font-bold text-amber-400">
                          {new Intl.NumberFormat('fa-IR').format(prod.price)} تومان
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="shrink-0">
                      {qty === 0 ? (
                        <button
                          id={`add-btn-${prod.id}`}
                          onClick={() => updateQuantity(prod.id, 1)}
                          className="px-3.5 py-1.5 bg-[var(--tg-theme-button-color)] hover:opacity-90 active:scale-95 text-[var(--tg-theme-button-text-color)] text-xs font-medium rounded-xl transition shadow flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>خرید</span>
                        </button>
                      ) : (
                        <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
                          <button
                            id={`minus-btn-${prod.id}`}
                            onClick={() => updateQuantity(prod.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg active:bg-slate-700"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {qty}
                          </span>
                          <button
                            id={`plus-btn-${prod.id}`}
                            onClick={() => updateQuantity(prod.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-sky-400 hover:text-sky-300 rounded-lg active:bg-slate-700"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart helper reminder */}
            {totalCartItems > 0 && (
              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200 text-xs flex items-center justify-between">
                <span>{totalCartItems} قلم کالا انتخاب شده</span>
                <span className="font-bold text-amber-300">
                  {new Intl.NumberFormat('fa-IR').format(totalCartPrice)} تومان
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. TASKS & REWARDS TAB */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-sky-500/15 to-indigo-500/20 border border-amber-500/30 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  امتیازها و رتبه شما
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  با انجام هر وظیفه، امتیازها مستقیماً در CloudStorage ذخیره می‌شوند.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{points}</span>
                <span className="text-[10px] text-slate-400 block">امتیاز کل</span>
              </div>
            </div>

            <div className="space-y-2">
              {tasks.map(t => (
                <div
                  key={t.id}
                  id={`task-item-${t.id}`}
                  className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-1.5 rounded-xl bg-slate-800 border border-slate-700/60">
                      {t.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{t.titleFa}</h4>
                      <span className="text-[11px] text-amber-400 font-medium">+{t.reward} امتیاز</span>
                    </div>
                  </div>

                  <button
                    id={`task-claim-${t.id}`}
                    disabled={t.completed}
                    onClick={() => handleClaimTask(t.id, t.reward)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all ${
                      t.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow'
                    }`}
                  >
                    {t.completed ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>انجام شد</span>
                      </>
                    ) : (
                      t.actionText
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TELEGRAM SDK API INSPECTOR */}
        {activeTab === 'api' && (
          <div className="space-y-3.5 text-xs">
            {/* Haptic Feedback tester */}
            <div className="p-3.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <Vibrate className="w-4 h-4 text-sky-400" />
                  <span>تست لرزش گوشی (HapticFeedback)</span>
                </h4>
                {hapticStatus && (
                  <span className="text-[10px] text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded-md">
                    {hapticStatus}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--tg-theme-hint-color)]">
                متد‌های رسمی تلگرام برای بازخورد لمسی در گوشی کاربر:
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="btn-haptic-light"
                  onClick={() => testHaptic('light')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-mono text-[11px]"
                >
                  impact(light)
                </button>
                <button
                  id="btn-haptic-medium"
                  onClick={() => testHaptic('medium')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-mono text-[11px]"
                >
                  impact(med)
                </button>
                <button
                  id="btn-haptic-heavy"
                  onClick={() => testHaptic('heavy')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-mono text-[11px]"
                >
                  impact(heavy)
                </button>
                <button
                  id="btn-haptic-success"
                  onClick={() => testHaptic('success')}
                  className="p-2 bg-emerald-900/40 hover:bg-emerald-900/60 text-emerald-300 rounded-xl border border-emerald-700/50 font-mono text-[11px]"
                >
                  notify(success)
                </button>
                <button
                  id="btn-haptic-error"
                  onClick={() => testHaptic('error')}
                  className="p-2 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 rounded-xl border border-rose-700/50 font-mono text-[11px]"
                >
                  notify(error)
                </button>
                <button
                  id="btn-haptic-select"
                  onClick={() => {
                    bridge.HapticFeedback.selectionChanged();
                    setHapticStatus('selectionChanged()');
                  }}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 font-mono text-[11px]"
                >
                  selection()
                </button>
              </div>
            </div>

            {/* Native Popups */}
            <div className="p-3.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>پاپ‌آپ‌های نیتیو تلگرام</span>
              </h4>
              <div className="flex gap-2">
                <button
                  id="btn-test-alert"
                  onClick={testAlert}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
                >
                  showAlert()
                </button>
                <button
                  id="btn-test-confirm"
                  onClick={testConfirm}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
                >
                  showConfirm()
                </button>
              </div>
            </div>

            {/* Cloud Storage API */}
            <div className="p-3.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>حافظه ابری تلگرام (CloudStorage)</span>
              </h4>
              <input
                id="cloud-storage-input"
                type="text"
                value={storageInput}
                onChange={e => setStorageInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                placeholder="متن دلخواه برای ذخیره در اکانت تلگرام..."
              />
              <div className="flex gap-2">
                <button
                  id="btn-save-cloud"
                  onClick={handleSaveToCloud}
                  className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium"
                >
                  ذخیره در CloudStorage
                </button>
                <button
                  id="btn-load-cloud"
                  onClick={handleLoadFromCloud}
                  className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700"
                >
                  بازخوانی اطلاعات
                </button>
              </div>
              <p className="text-[10px] text-slate-400 bg-black/20 p-2 rounded-lg font-mono">
                {cloudStorageStatus}
              </p>
            </div>

            {/* SendData to Bot */}
            <div className="p-3.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-2">
              <h4 className="font-semibold text-white flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>ارسال مستقیم دیتا به ربات (sendData)</span>
              </h4>
              <p className="text-[11px] text-[var(--tg-theme-hint-color)]">
                این متد مینی‌اپ را می‌بندد و دیتا را به صورت پیام به چت ربات می‌فرستد.
              </p>
              <button
                id="btn-send-data-test"
                onClick={() => {
                  const testPayload = {
                    action: 'quick_ping',
                    userId: user.id,
                    message: 'سلام از Mini App روی کلودفلر!',
                    time: new Date().toLocaleTimeString('fa-IR')
                  };
                  bridge.HapticFeedback.notificationOccurred('success');
                  if (onSendData) onSendData(testPayload);
                  bridge.sendData(JSON.stringify(testPayload));
                  showToast('دیتا به بات ارسال شد!');
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow"
              >
                اجرای Telegram.WebApp.sendData()
              </button>
            </div>
          </div>
        )}

        {/* 4. PROFILE & RAW INITDATA TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-3.5 text-xs">
            <div className="p-4 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden border-2 border-white/20">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user.first_name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    {user.first_name} {user.last_name || ''}
                    {user.is_premium && <span className="text-sky-400 text-xs">★</span>}
                  </h3>
                  <p className="text-slate-400 text-xs">@{user.username || 'بدون نام کاربری'}</p>
                  <p className="text-slate-500 text-[11px] font-mono">Telegram ID: {user.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/40 text-[11px]">
                <div className="p-2 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block">زبان تلگرام:</span>
                  <span className="font-semibold text-white">{user.language_code || 'fa'}</span>
                </div>
                <div className="p-2 bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 block">نسخه پلتفرم:</span>
                  <span className="font-semibold text-white font-mono">{bridge.platform} v{bridge.version}</span>
                </div>
              </div>
            </div>

            {/* Raw initData details */}
            <div className="p-3.5 bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl border border-slate-700/40 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>داده‌های امنیتی (initData)</span>
                </h4>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  SHA-256 Validated
                </span>
              </div>
              <p className="text-[11px] text-[var(--tg-theme-hint-color)]">
                کلودفلر با استفاده از هش موجود در این رشته، اصالت کاربر و عدم دستکاری را تضمین می‌کند:
              </p>
              <div className="p-2.5 bg-black/40 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300 break-all leading-relaxed max-h-28 overflow-y-auto">
                {bridge.initData}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
