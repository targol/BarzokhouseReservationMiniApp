import { TelegramWebAppBridge, TelegramUser, TelegramThemeParams } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

// Default mock user
export const DEFAULT_MOCK_USER: TelegramUser = {
  id: 74829103,
  first_name: 'کاربر تلگرام',
  last_name: 'Cloudflare',
  username: 'cloudflare_dev',
  language_code: 'fa',
  is_premium: true,
  photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

export const DEFAULT_THEME_DARK: TelegramThemeParams = {
  bg_color: '#17212b',
  text_color: '#f5f5f5',
  hint_color: '#708499',
  link_color: '#6ab2f2',
  button_color: '#5288c1',
  button_text_color: '#ffffff',
  secondary_bg_color: '#232e3c',
  header_bg_color: '#17212b',
  accent_text_color: '#6ab2f2',
  section_bg_color: '#17212b',
  section_header_text_color: '#6ab2f2',
  subtitle_text_color: '#708499',
  destructive_text_color: '#ec3942',
};

export const DEFAULT_THEME_LIGHT: TelegramThemeParams = {
  bg_color: '#ffffff',
  text_color: '#000000',
  hint_color: '#8e8e93',
  link_color: '#2481cc',
  button_color: '#2481cc',
  button_text_color: '#ffffff',
  secondary_bg_color: '#f4f4f5',
  header_bg_color: '#ffffff',
  accent_text_color: '#2481cc',
  section_bg_color: '#ffffff',
  section_header_text_color: '#2481cc',
  subtitle_text_color: '#8e8e93',
  destructive_text_color: '#ff3b30',
};

// Event listeners storage for the mock
type Callback = (...args: any[]) => void;
const mainButtonClickListeners: Set<Callback> = new Set();
const backButtonClickListeners: Set<Callback> = new Set();

let cloudStorageData: Record<string, string> = {
  user_score: '250',
  daily_streak: '3',
  selected_lang: 'fa',
};

export class TelegramBridge {
  private static instance: TelegramWebAppBridge | null = null;
  private static listeners: Array<(event: string, data?: any) => void> = [];

  public static addEventListener(listener: (event: string, data?: any) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify(event: string, data?: any) {
    this.listeners.forEach(cb => cb(event, data));
  }

  public static getBridge(overrideUser?: TelegramUser, isDarkMode = true): TelegramWebAppBridge {
    // If running in real Telegram client with real initData
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.initData) {
      return window.Telegram.WebApp as TelegramWebAppBridge;
    }

    const activeUser = overrideUser || DEFAULT_MOCK_USER;
    const activeTheme = isDarkMode ? DEFAULT_THEME_DARK : DEFAULT_THEME_LIGHT;

    const mockInitData = `query_id=AAHnFwcEAAAAAOcXBsQW9J2g&user=${encodeURIComponent(
      JSON.stringify(activeUser)
    )}&auth_date=${Math.floor(Date.now() / 1000)}&hash=4a926bdf9e7e1a38c9285fbbe6481774b971a81dc3d623293dc2c2c019d3f1d5`;

    const bridge: TelegramWebAppBridge = {
      initData: mockInitData,
      initDataUnsafe: {
        query_id: 'AAHnFwcEAAAAAOcXBsQW9J2g',
        user: activeUser,
        auth_date: Math.floor(Date.now() / 1000),
        hash: '4a926bdf9e7e1a38c9285fbbe6481774b971a81dc3d623293dc2c2c019d3f1d5',
        start_param: 'from_bot',
      },
      version: '7.10',
      platform: 'tdesktop',
      colorScheme: isDarkMode ? 'dark' : 'light',
      themeParams: activeTheme,
      isExpanded: true,
      viewportHeight: 650,
      viewportStableHeight: 650,
      headerColor: activeTheme.header_bg_color || '#17212b',
      backgroundColor: activeTheme.bg_color || '#17212b',

      MainButton: {
        text: 'ادامه',
        color: activeTheme.button_color || '#5288c1',
        textColor: activeTheme.button_text_color || '#ffffff',
        isVisible: false,
        isActive: true,
        isProgressVisible: false,
        setText(text: string) {
          this.text = text;
          TelegramBridge.notify('mainButtonChange', { ...this, text });
        },
        show() {
          this.isVisible = true;
          TelegramBridge.notify('mainButtonChange', { ...this, isVisible: true });
        },
        hide() {
          this.isVisible = false;
          TelegramBridge.notify('mainButtonChange', { ...this, isVisible: false });
        },
        enable() {
          this.isActive = true;
          TelegramBridge.notify('mainButtonChange', { ...this, isActive: true });
        },
        disable() {
          this.isActive = false;
          TelegramBridge.notify('mainButtonChange', { ...this, isActive: false });
        },
        showProgress(leaveActive = false) {
          this.isProgressVisible = true;
          if (!leaveActive) this.isActive = false;
          TelegramBridge.notify('mainButtonChange', { ...this, isProgressVisible: true });
        },
        hideProgress() {
          this.isProgressVisible = false;
          this.isActive = true;
          TelegramBridge.notify('mainButtonChange', { ...this, isProgressVisible: false, isActive: true });
        },
        onClick(callback: () => void) {
          mainButtonClickListeners.add(callback);
        },
        offClick(callback: () => void) {
          mainButtonClickListeners.delete(callback);
        },
        setParams(params) {
          if (params.text) this.text = params.text;
          if (params.color) this.color = params.color;
          if (params.text_color) this.textColor = params.text_color;
          if (typeof params.is_active === 'boolean') this.isActive = params.is_active;
          if (typeof params.is_visible === 'boolean') this.isVisible = params.is_visible;
          TelegramBridge.notify('mainButtonChange', { ...this });
        },
      },

      BackButton: {
        isVisible: false,
        show() {
          this.isVisible = true;
          TelegramBridge.notify('backButtonChange', { isVisible: true });
        },
        hide() {
          this.isVisible = false;
          TelegramBridge.notify('backButtonChange', { isVisible: false });
        },
        onClick(callback: () => void) {
          backButtonClickListeners.add(callback);
        },
        offClick(callback: () => void) {
          backButtonClickListeners.delete(callback);
        },
      },

      HapticFeedback: {
        impactOccurred(style) {
          TelegramBridge.notify('haptic', { type: 'impact', style });
          if ('vibrate' in navigator) {
            const ms = style === 'heavy' ? 40 : style === 'medium' ? 25 : 12;
            navigator.vibrate(ms);
          }
        },
        notificationOccurred(type) {
          TelegramBridge.notify('haptic', { type: 'notification', status: type });
          if ('vibrate' in navigator) {
            navigator.vibrate(type === 'error' ? [40, 60, 40] : [25, 40]);
          }
        },
        selectionChanged() {
          TelegramBridge.notify('haptic', { type: 'selection' });
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        },
      },

      CloudStorage: {
        setItem(key, value, callback) {
          cloudStorageData[key] = value;
          TelegramBridge.notify('cloudStorage', { key, value, action: 'set' });
          if (callback) callback(null, true);
        },
        getItem(key, callback) {
          const val = cloudStorageData[key] || '';
          if (callback) callback(null, val);
        },
        getItems(keys, callback) {
          const res: Record<string, string> = {};
          keys.forEach(k => {
            if (cloudStorageData[k] !== undefined) res[k] = cloudStorageData[k];
          });
          if (callback) callback(null, res);
        },
        removeItem(key, callback) {
          delete cloudStorageData[key];
          TelegramBridge.notify('cloudStorage', { key, action: 'remove' });
          if (callback) callback(null, true);
        },
        getKeys(callback) {
          if (callback) callback(null, Object.keys(cloudStorageData));
        },
      },

      ready() {
        TelegramBridge.notify('ready');
      },

      expand() {
        this.isExpanded = true;
        TelegramBridge.notify('expand');
      },

      close() {
        TelegramBridge.notify('close');
      },

      sendData(data: string) {
        TelegramBridge.notify('sendData', data);
      },

      openLink(url: string) {
        window.open(url, '_blank');
      },

      openTelegramLink(url: string) {
        TelegramBridge.notify('openTelegramLink', url);
        window.open(url, '_blank');
      },

      showAlert(message: string, callback?: () => void) {
        TelegramBridge.notify('alert', { message, callback });
        // Fallback custom toast instead of blocking window.alert
      },

      showConfirm(message: string, callback?: (confirmed: boolean) => void) {
        TelegramBridge.notify('confirm', { message, callback });
      },

      showPopup(params, callback) {
        TelegramBridge.notify('popup', { params, callback });
      },

      setHeaderColor(color: string) {
        this.headerColor = color;
        TelegramBridge.notify('headerColor', color);
      },

      setBackgroundColor(color: string) {
        this.backgroundColor = color;
        TelegramBridge.notify('bgColor', color);
      },

      requestContact(callback?: (granted: boolean, response: any) => void) {
        const phone = activeUser?.phone_number || '09123456789';
        if (callback) {
          callback(true, {
            status: 'sent',
            contact: {
              phone_number: phone,
              first_name: activeUser?.first_name || 'مهمان',
              user_id: activeUser?.id || 12345678
            },
            responseUnsafe: {
              contact: {
                phone_number: phone,
                first_name: activeUser?.first_name || 'مهمان',
                user_id: activeUser?.id || 12345678
              }
            }
          });
        }
        TelegramBridge.notify('contactRequested', {
          status: 'sent',
          response: {
            contact: {
              phone_number: phone
            }
          }
        });
      },
    };

    // Attach to window.Telegram if not already present
    if (typeof window !== 'undefined') {
      window.Telegram = window.Telegram || {};
      window.Telegram.WebApp = bridge;
    }

    return bridge;
  }

  public static triggerMainButtonClick() {
    mainButtonClickListeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in MainButton handler', e);
      }
    });
  }

  public static triggerBackButtonClick() {
    backButtonClickListeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in BackButton handler', e);
      }
    });
  }
}
