/**
 * ==========================================================================
 * اقامتگاه بومگردی «خانه برزک» - Telegram Mini App Logic (Vanilla JS)
 * بدون کتابخانه سنگین، آماده برای میزبانی استاتیک در Cloudflare Pages
 * و اتصال آسان به Cloudflare Worker در آینده
 * ==========================================================================
 */

// ۱. تنظیمات متمرکز و اطلاعات قابل تغییر (Configuration)
const CONFIG = {
  lodgeName: "اقامتگاه بومگردی خانه برزک",
  phone1: "09354868840",                  // شماره تماس اول خانه برزک
  phone1Display: "0935 486 8840",         // شماره تماس اول جهت نمایش LTR
  phone2: "09125472055",                  // شماره تماس دوم خانه برزک
  phone2Display: "0912 547 2055",         // شماره تماس دوم جهت نمایش LTR
  phone: "09354868840",                  // پشتیبانی از کد‌های قدیمی
  phoneDisplay: "0935 486 8840",
  telegram: "https://t.me/barzokhouse",   // آدرس چنل یا پشتیبانی تلگرام
  instagram: "https://instagram.com/barzokhouse", // آدرس اینستاگرام
  website: "https://barzokhouse.com",     // وب‌سایت رسمی خانه برزک
  address: "استان اصفهان، شهرستان کاشان، شهر برزک، محله سَرِدُل، بعد از اداره آب، اقامتگاه بومگردی خانه برزک",
  latitude: "33.78289783354854",         // موقعیت دقیق جغرافیایی برزک
  longitude: "51.22915745964105",
  mapUrl: "https://maps.google.com/?q=33.78289783354854,51.22915745964105", // لینک نقشه
  weatherUrl: "https://www.accuweather.com/en/ir/azaran/208117/weather-forecast/208117?type=place&placename=barzok%20house",
  roomsInfoUrl: "https://barzokhouse.com/مشاهده-اتاق-ها",
  rulesUrl: "https://barzokhouse.com/شرایط-خانه-و-ورود-مهمان/",
  greenTravelUrl: "https://barzokhouse.com/green-eco-lodge/",
  foodMenuUrl: "https://barzokhouse.com/%d8%af%d8%b3%d8%aa%d9%88%d8%b1-%d9%be%d8%ae%d8%aa-%d8%ba%d8%b0%d8%a7%d9%87%d8%a7/",
  googleMapsReviewUrl: "https://maps.app.goo.gl/aC1vyJ9T5Q4jJkMy6",
  tripAdvisorUrl: "https://www.tripadvisor.com/Hotel_Review-g680023-d8618364-Reviews-Barzok_House-Kashan_Isfahan_Province.html",
  // لینک اختصاصی گروه تلگرام برای ارسال درخواست‌های رزرو خانه برزک
  reservationGroupUrl: "https://t.me/+wigY6VanuYplYTk8",
  // آدرس Cloudflare Worker برای پردازش درخواست و ارسال مستقیم به گروه تلگرام
  workerUrl: "https://barzokhousereservationminiapp.targol.workers.dev"
};

// ۲. اطلاعات اتاق‌ها (Rooms Data)
const ROOMS = [
  {
    id: "shatoot",
    name: "شاتوت",
    capacity: 2,
    beds: "۱ تخت دو نفره + ۲ سرویس کف‌خواب سنتی",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر شب اقامت با صبحانه ۱,۳۰۰,۰۰۰ تومان.",
    description: "ادر خانه جدید، همراه با یک تخت دو نفره، پنکه دیواری، بخاری گازی، سرویس بهداشتی ایرانی و حمام اختصای.",
    amenities: ["سرویس بهداشتی و حمام اختصاصی", "سیستم سرمایش و گرمایش", "صبحانه محلی", "وای‌فای رایگان", "چای ایرانی تازه دم"],
    images: ["./assets/rooms/shatoot.webp"]
  },
  {
    id: "ghaali",
    name: "قالی",
    capacity: 3,
    beds: "۲ تخت یک نفره + ۱ سرویس سنتی",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر شب اقامت با صبحانه محلی ۱,۳۰۰,۰۰۰ تومان. همراه با صبحانه ارگانیک روستایی و کرسی سنتی فعال در فصول سرد سال.",
    description: "یادآور هنر اصیل قالی‌بافی برزک و کاشان با دست‌بافته‌های پشمی نفیس و کرسی سنتی گرم. انتخابی ایده‌آل برای تجربه فرهنگ زیست بومی و آرامش محض کوهستان.",
    amenities: ["کرسی سنتی گرم در زمستان", "سرویس بهداشتی اختصاصی", "دست‌بافته‌های اصیل", "سیستم تهویه", "صبحانه محلی", "چای‌خانه سنتی"],
    images: ["./assets/rooms/ghaali.webp"]
  },
  {
    id: "abi",
    name: "آبی",
    capacity: 2,
    beds: "۱ تخت دو نفره",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر شب اقامت با صبحانه محلی ۱,۳۰۰,۰۰۰ تومان. مناسب اقامت دونفره و زوج‌ها؛ همراه با صبحانه و پذیرایی عرقیات گیاهی ناب برزک.",
    description: "اتاقی دل‌انگیز با نقاشی‌ها و کاشی‌کاری‌های لاجوردی و فیروزه‌ای الهام‌گرفته از آسمان پاک برزک. نورگیر عالی به حیاط عمارت با شیشه‌های رنگی ارسی.",
    amenities: ["نورگیر طبیعی به حیاط مرکزی", "حمام و سرویس اختصاصی", "اسپلیت سرمایشی/گرمایشی", "صبحانه روستایی", "پذیرایی عرقیات ارگانیک"],
    images: ["./assets/rooms/abi.webp"]
  },
  {
    id: "sara",
    name: "سرا",
    capacity: 5,
    beds: "۵ سرویس کف‌خواب سنتی دست‌دوز با تشک و لحاف پنبه‌ای",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر شب اقامت با صبحانه محلی ۱,۳۰۰,۰۰۰ تومان. مناسب خانواده‌ها و دورهمی‌های صمیمی دوستانه.",
    description: "بزرگ‌ترین و اصیل‌ترین شاه‌نشین اقامتگاه با طاق‌های خشتی مرتفع، پنج‌دری‌های رو به باغ و نورگیرهای زیبا، مناسب دورهمی‌های خاطره‌انگیز خانوادگی.",
    amenities: ["فضای بزرگ نشیمن سنتی", "سرویس بهداشتی و حمام اختصاصی", "لحاف و تشک سنتی اعلا", "سیستم گرمایش و سرمایش", "صبحانه محلی کامل"],
    images: ["./assets/rooms/sara.webp"]
  },
  {
    id: "balakhoneh",
    name: "بالاخونه",
    capacity: 3,
    beds: "۱ تخت دو نفره + ۱ سرویس سنتی",
    price: 1200000,
    priceDisplay: "۱,۲۰۰,۰۰۰ تومان",
    priceNote: "هر نفر شب اقامت با صبحانه محلی ۱,۲۰۰,۰۰۰ تومان. دارای ایوان اختصاصی با چشم‌انداز ۳۶۰ درجه به دره و باغات گردو و گل محمدی.",
    description: "واقع در بالاترین نقطه عمارت تاریخی با تراس بزرگ اختصاصی رو به طبیعت بکر و کوه‌های سرسبز برزک. هوایی بسیار لطیف با نسیم خنک کوهستانی.",
    amenities: ["تراس و ایوان با منظره اختصاصی", "میز و صندلی چوبی در ایوان", "سرویس بهداشتی و حمام اختصاصی", "اسپلیت", "صبحانه سنتی"],
    images: ["./assets/rooms/balakhoneh.webp"]
  }
];

// ۳. منوی غذاهای محلی (Food Menu Data)
const FOOD_MENU = [
  {
    id: "food_1",
    name: "گوشت لوبیا کاشان",
    category: "غذای اصیل سنتی",
    price: 240000,
    priceDisplay: "۲۴۰,۰۰۰ تومان",
    description: "خوراک سنتی گوشت گرم گوسفندی پخته‌شده با لوبیای سفید در دیگ مسی به همراه نان سنگک تازه، ترشی خانگی و سبزی محلی."
  },
  {
    id: "food_2",
    name: "آبگوشت به و سرکه شیره برزک",
    category: "غذای ملی ثبت‌شده برزک",
    price: 260000,
    priceDisplay: "۲۶۰,۰۰۰ تومان",
    description: "شاهکار ثبت ملی شده طعم‌های برزک؛ ترکیبی از گوشت گوسفندی، به کوهی برزک و سرکه شیره خانگی با طعم ملس و بی‌نظیر."
  },
  {
    id: "food_3",
    name: "شفته سماق برزک",
    category: "غذای سنتی محلی",
    price: 210000,
    priceDisplay: "۲۱۰,۰۰۰ تومان",
    description: "کوفته‌های ریز و برشته سنتی همراه با سس ترش و ملس سماق کوهی تازه، پیازداغ عسلی و برنج خوش‌عطر ایرانی."
  },
  {
    id: "food_4",
    name: "خورش قیمه ریزه با پلو",
    category: "غذای سنتی",
    price: 220000,
    priceDisplay: "۲۲۰,۰۰۰ تومان",
    description: "کوفته‌ریزه‌های نخودچی لطیف با سس گوجه‌فرنگی ارگانیک و نعناع داغ محلی همراه با چلوی زعفرانی."
  },
  {
    id: "food_5",
    name: "کال‌جوش با گردوی تازه برزک",
    category: "خوراک مقوی سنتی",
    price: 180000,
    priceDisplay: "۱۸۰,۰۰۰ تومان",
    description: "کشک محلی گوسفندی جوشیده با نعناع داغ، پیازداغ و مغز گردوی اعلای باغات برزک با عطر سرمست‌کننده."
  },
  {
    id: "food_6",
    name: "کوفته برنجی برزک",
    category: "کوفته سنتی",
    price: 210000,
    priceDisplay: "۲۱۰,۰۰۰ تومان",
    description: "کوفته پرملات با مغز آلو بخارا، گردو، زرشک کوهی و سبزیجات معطر ارتفاعات برزک."
  }
];

// ۴. وضعیت کلی برنامه (App State)
const state = {
  screenStack: ["screen-home"], // پشته صفحات برای بازگشت دقیق
  selectedRoomId: "shatoot",
  reservation: {
    nights: 1,
    guests: 2,
    checkInDate: getTomorrowFormattedDate(),
    checkOutDate: "",
    name: "",
    phone: ""
  },
  foodOrder: {
    name: "",
    phone: "",
    date: getTodayFormattedDate(),
    dayOfWeek: "جمعه",
    mealType: "ناهار",
    isGroupTravel: false,
    // در هر وعده حداکثر ۱ نوع غذا، و در سفر گروهی حداکثر ۲ نوع غذا: { [foodId]: quantity }
    selectedDishes: {}
  }
};

// ۵. راه‌اندازی Telegram WebApp API
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

function initTelegramWebApp() {
  if (tg) {
    try {
      tg.ready();
      tg.expand();

      // تنظیم رنگ هدر با هویت خانه برزک
      if (tg.setHeaderColor) {
        tg.setHeaderColor("#233e33");
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#faf8f5");
      }

      // شنود رویداد دکمه Back بومی تلگرام
      if (tg.BackButton) {
        tg.BackButton.onClick(() => {
          triggerHaptic('light');
          navigateBack();
        });
      }

      // دریافت نام کاربر تلگرام به عنوان پیش‌فرض در فرم‌ها (با قابلیت ویرایش)
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const u = tg.initDataUnsafe.user;
        const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
        if (fullName) {
          state.reservation.name = fullName;
          state.foodOrder.name = fullName;
        }
      }
    } catch (e) {
      console.warn("Telegram WebApp initialization note:", e);
    }
  }
}

// بازخورد لمسی تلگرام (Haptic Feedback)
function triggerHaptic(type = 'light') {
  if (tg && tg.HapticFeedback) {
    try {
      if (type === 'light' || type === 'medium' || type === 'heavy') {
        tg.HapticFeedback.impactOccurred(type);
      } else if (type === 'success' || type === 'warning' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type);
      }
    } catch (e) {
      // safe fallback
    }
  }
}

// تابع باز کردن امن لینک‌های خارجی و تلگرام درون وب‌اپلیکیشن تلگرام
function openExternalUrl(url) {
  triggerHaptic('light');
  if (!url) return;

  if (url.startsWith('tel:')) {
    window.location.href = url;
    return;
  }

  if (tg) {
    if (url.includes('t.me/') && tg.openTelegramLink) {
      tg.openTelegramLink(url);
      return;
    }
    if (tg.openLink) {
      tg.openLink(url);
      return;
    }
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ۶. مدیریت Navigation و بازگشت یکپارچه (SPA بدون Reload)
function navigateTo(screenId) {
  triggerHaptic('light');
  const currentScreenId = state.screenStack[state.screenStack.length - 1];
  if (currentScreenId === screenId) return;

  state.screenStack.push(screenId);
  renderCurrentScreen();
}

function navigateBack() {
  triggerHaptic('light');
  if (state.screenStack.length > 1) {
    state.screenStack.pop();
    renderCurrentScreen();
  }
}

function renderCurrentScreen() {
  const targetId = state.screenStack[state.screenStack.length - 1];

  // مخفی کردن تمامی اسکرین‌ها و نمایش اسکرین فعال
  document.querySelectorAll(".screen").forEach(el => {
    el.classList.remove("active");
  });

  const activeEl = document.getElementById(targetId);
  if (activeEl) {
    activeEl.classList.add("active");
  }

  // مدیریت نمایش یا مخفی‌سازی دکمه Back بومی تلگرام
  if (tg && tg.BackButton) {
    if (state.screenStack.length > 1) {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  }

  // اسکرول نرم به بالای صفحه
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ۷. توابع محاسبات تاریخ و مبالغ
function getTodayFormattedDate() {
  const now = new Date();
  return formatDateToString(now);
}

function getTomorrowFormattedDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateToString(d);
}

function formatDateToString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysToDateString(dateStr, days) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      d.setDate(d.getDate() + parseInt(days, 10));
      return formatDateToString(d);
    }
  } catch (e) {}
  return dateStr;
}

function formatPersianNumber(n) {
  if (n === null || n === undefined) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/[0-9]/g, w => persianDigits[+w]);
}

function formatToman(amount) {
  const parts = Number(amount).toLocaleString('en-US');
  return formatPersianNumber(parts) + " تومان";
}

// ۸. رندر کردن بخش‌ها و کارت‌ها
function renderRoomsList() {
  const container = document.getElementById("rooms-list-container");
  if (!container) return;

  container.innerHTML = ROOMS.map(room => `
    <div class="room-card" id="room-card-${room.id}">
      <div class="room-card-img-wrap">
        <img src="${room.images[0]}" alt="${room.name}" class="room-card-img" loading="lazy" onerror="if(!this.dataset.err){this.dataset.err='1';this.src='./assets/rooms/${room.id}.svg';}" />
        <span class="room-card-capacity">👥 تا ${formatPersianNumber(room.capacity)} نفر</span>
      </div>
      <div class="room-card-body">
        <div class="room-card-title-row">
          <h3 class="room-card-title">اتاق ${room.name}</h3>
          <span class="room-card-price">${formatToman(room.price)} <small style="font-size: 11px; font-weight: normal; color: var(--brand-text-muted);">/ نفرشب با صبحانه</small></span>
        </div>
        <button class="btn btn-outline" onclick="openRoomDetail('${room.id}')" style="margin-top: 8px;">
          مشاهده مشخصات و عکس‌های اتاق ←
        </button>
      </div>
    </div>
  `).join("");
}

function openRoomDetail(roomId) {
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;

  state.selectedRoomId = roomId;

  // مقداردهی ویوی جزئیات اتاق
  document.getElementById("detail-room-name").textContent = `اتاق ${room.name}`;
  const detailImg = document.getElementById("detail-room-img");
  if (detailImg) {
    detailImg.src = room.images[0];
    detailImg.alt = room.name;
    detailImg.onerror = function() {
      if (!this.dataset.err) {
        this.dataset.err = '1';
        this.src = `./assets/rooms/${room.id}.svg`;
      }
    };
  }
  document.getElementById("detail-capacity").textContent = `تا ${formatPersianNumber(room.capacity)} نفر`;
  document.getElementById("detail-beds").textContent = room.beds;
  document.getElementById("detail-price").textContent = formatToman(room.price) + " / هر نفر شب اقامت با صبحانه";
  document.getElementById("detail-price-note").textContent = room.priceNote;
  document.getElementById("detail-desc").textContent = room.description;

  // امکانات
  const amenitiesWrap = document.getElementById("detail-amenities");
  amenitiesWrap.innerHTML = room.amenities.map(a => `
    <span class="amenity-chip">✓ ${a}</span>
  `).join("");

  // هدایت به صفحه جزئیات اتاق
  navigateTo("screen-room-detail");
}

function startReservationForCurrentRoom() {
  // پر کردن مقدار سلکتور اتاق در فرم رزرو
  const selectEl = document.getElementById("res-room-select");
  if (selectEl) {
    selectEl.value = state.selectedRoomId;
  }
  updateReservationCalculations();
  navigateTo("screen-reservation");
}

// ۹. فرم و محاسبات درخواست رزرو یکپارچه (اقامت + خوراک)
function updateReservationCalculations() {
  const roomSelect = document.getElementById("res-room-select");
  const selectedId = roomSelect ? roomSelect.value : state.selectedRoomId;
  const room = ROOMS.find(r => r.id === selectedId) || ROOMS[0];

  const checkInInput = document.getElementById("res-checkin-date");
  const checkInVal = checkInInput ? checkInInput.value : state.reservation.checkInDate;
  
  // محاسبه خودکار تاریخ خروج
  const checkOutVal = addDaysToDateString(checkInVal, state.reservation.nights);
  state.reservation.checkOutDate = checkOutVal;

  const checkOutDisplay = document.getElementById("res-checkout-display");
  if (checkOutDisplay) {
    checkOutDisplay.textContent = formatPersianNumber(checkOutVal);
  }

  // همگام‌سازی فیلدهای مشترک با فرم سفارش غذا
  const resNameInput = document.getElementById("res-name");
  const resPhoneInput = document.getElementById("res-phone");
  if (resNameInput && resNameInput.value) {
    state.reservation.name = resNameInput.value.trim();
    state.foodOrder.name = state.reservation.name;
    const foodNameInput = document.getElementById("food-name");
    if (foodNameInput && !foodNameInput.value) foodNameInput.value = state.reservation.name;
  }
  if (resPhoneInput && resPhoneInput.value) {
    state.reservation.phone = resPhoneInput.value.trim();
    state.foodOrder.phone = state.reservation.phone;
    const foodPhoneInput = document.getElementById("food-phone");
    if (foodPhoneInput && !foodPhoneInput.value) foodPhoneInput.value = state.reservation.phone;
  }
  if (checkInVal) {
    state.reservation.checkInDate = checkInVal;
    state.foodOrder.date = checkInVal;
    const foodDateInput = document.getElementById("food-date");
    if (foodDateInput && !foodDateInput.value) foodDateInput.value = checkInVal;
  }

  // نمایش تعداد شب و نفرات در استپرها
  const nightsValEl = document.getElementById("res-nights-val");
  if (nightsValEl) {
    nightsValEl.textContent = formatPersianNumber(state.reservation.nights) + " شب";
  }

  const guestsValEl = document.getElementById("res-guests-val");
  if (guestsValEl) {
    guestsValEl.textContent = formatPersianNumber(state.reservation.guests) + " نفر";
  }

  // محاسبه مبلغ اقامت
  const roomEstimate = state.reservation.nights * state.reservation.guests * room.price;

  // محاسبه مبلغ غذاهای انتخابی (در صورت وجود)
  const selectedFoodIds = Object.keys(state.foodOrder.selectedDishes);
  let foodEstimate = 0;
  selectedFoodIds.forEach(id => {
    const dish = FOOD_MENU.find(d => d.id === id);
    const qty = state.foodOrder.selectedDishes[id] || 1;
    if (dish) foodEstimate += dish.price * qty;
  });

  const grandTotal = roomEstimate + foodEstimate;

  // به‌روزرسانی کارت تعاملی غذا در فرم رزرو
  const foodCard = document.getElementById("unified-food-card");
  const foodBadge = document.getElementById("unified-food-badge");
  const foodContent = document.getElementById("unified-food-content");

  if (foodCard && foodBadge && foodContent) {
    if (selectedFoodIds.length === 0) {
      foodCard.classList.remove("has-food");
      foodBadge.textContent = "بدون غذا";
      foodBadge.style.background = "var(--brand-surface-subtle)";
      foodBadge.style.color = "var(--brand-text-muted)";
      foodContent.innerHTML = `
        <p class="unified-food-empty">
          می‌توانید وعده‌های غذایی سنتی برزک (ناهار یا شام) را نیز به همین درخواست اضافه کنید تا تمام موارد به‌صورت یکجا و هم‌زمان به گروه رزرو ارسال شوند.
        </p>
        <button type="button" class="btn btn-outline" style="font-size: 13px; padding: 8px 14px;" onclick="navigateToFoodFromReservation()">
          + انتخاب غذاهای محلی از منو
        </button>
      `;
    } else {
      foodCard.classList.add("has-food");
      foodBadge.textContent = `همراه با غذا (${formatPersianNumber(selectedFoodIds.length)} نوع)`;
      foodBadge.style.background = "var(--brand-teal-subtle)";
      foodBadge.style.color = "var(--brand-teal-dark)";

      const dishesListHtml = selectedFoodIds.map(id => {
        const dish = FOOD_MENU.find(d => d.id === id);
        const qty = state.foodOrder.selectedDishes[id];
        return `
          <div class="unified-food-item">
            <span>🍲 ${dish ? dish.name : id} × ${formatPersianNumber(qty)} پرس</span>
            <span>${dish ? formatToman(dish.price * qty) : ''}</span>
          </div>
        `;
      }).join("");

      foodContent.innerHTML = `
        <div class="unified-food-dishes-list">
          ${dishesListHtml}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 12.5px; color: var(--brand-teal-dark); font-weight: 700;">
          <span>وعده: ${state.foodOrder.mealType || 'ناهار'} (${state.foodOrder.dayOfWeek || 'جمعه'})</span>
          <span>جمع غذا: ${formatToman(foodEstimate)}</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button type="button" class="btn btn-outline" style="font-size: 12px; padding: 6px 12px; flex: 1;" onclick="navigateToFoodFromReservation()">
            ✏️ ویرایش غذاها
          </button>
          <button type="button" class="btn btn-outline" style="font-size: 12px; padding: 6px 12px; color: #b23b3b; border-color: #f1cfcf;" onclick="clearFoodFromReservation()">
            🗑️ حذف غذا از اقامت
          </button>
        </div>
      `;
    }
  }

  // به‌روزرسانی جعبه برآورد یکپارچه
  const summaryRoomEl = document.getElementById("res-summary-room");
  const summaryRoomPriceEl = document.getElementById("res-summary-room-price");
  const summaryFoodRowEl = document.getElementById("res-summary-food-row");
  const summaryFoodTitleEl = document.getElementById("res-summary-food-title");
  const summaryFoodPriceEl = document.getElementById("res-summary-food-price");
  const summaryTotalEl = document.getElementById("res-summary-total");

  if (summaryRoomEl) {
    summaryRoomEl.textContent = `اتاق ${room.name} (${formatPersianNumber(state.reservation.guests)} نفر، ${formatPersianNumber(state.reservation.nights)} شب با صبحانه)`;
  }
  if (summaryRoomPriceEl) {
    summaryRoomPriceEl.textContent = formatToman(roomEstimate);
  }

  if (summaryFoodRowEl && summaryFoodPriceEl) {
    if (selectedFoodIds.length > 0) {
      summaryFoodRowEl.style.display = "flex";
      if (summaryFoodTitleEl) {
        summaryFoodTitleEl.textContent = `سفارش خوراک سنتی (${state.foodOrder.mealType || 'ناهار'}):`;
      }
      summaryFoodPriceEl.textContent = formatToman(foodEstimate);
    } else {
      summaryFoodRowEl.style.display = "none";
    }
  }

  if (summaryTotalEl) {
    summaryTotalEl.textContent = formatToman(grandTotal);
  }
}

function changeReservationNights(delta) {
  triggerHaptic('light');
  let n = state.reservation.nights + delta;
  if (n < 1) n = 1;
  if (n > 14) n = 14;
  state.reservation.nights = n;
  updateReservationCalculations();
}

function changeReservationGuests(delta) {
  triggerHaptic('light');
  const roomSelect = document.getElementById("res-room-select");
  const selectedId = roomSelect ? roomSelect.value : state.selectedRoomId;
  const room = ROOMS.find(r => r.id === selectedId) || ROOMS[0];

  let g = state.reservation.guests + delta;
  if (g < 1) g = 1;
  if (g > room.capacity + 2) g = room.capacity + 2;
  state.reservation.guests = g;
  updateReservationCalculations();
}

// هدایت کاربر از فرم اقامت به منوی غذا
function navigateToFoodFromReservation() {
  triggerHaptic('light');
  syncReservationToFoodInputs();
  navigateTo("screen-food");
}

// ذخیره انتخاب غذا و بازگشت به فرم اقامت
function saveFoodAndReturnToReservation() {
  triggerHaptic('medium');
  syncFoodToReservationInputs();
  updateReservationCalculations();
  navigateTo("screen-reservation");
  showToast("غذاهای انتخابی با موفقیت به سفارش اقامت اضافه شدند.");
}

// حذف سفارش غذا از اقامت
function clearFoodFromReservation() {
  triggerHaptic('light');
  state.foodOrder.selectedDishes = {};
  updateReservationCalculations();
  renderFoodSection();
  showToast("سفارش غذا از درخواست اقامت حذف شد.");
}

// همگام‌سازی ورودی‌های فرم اقامت با فرم غذا
function syncReservationToFoodInputs() {
  const resName = document.getElementById("res-name")?.value.trim() || state.reservation.name;
  const resPhone = document.getElementById("res-phone")?.value.trim() || state.reservation.phone;
  const resDate = document.getElementById("res-checkin-date")?.value || state.reservation.checkInDate;

  if (resName) {
    state.reservation.name = resName;
    state.foodOrder.name = resName;
    const foodNameInput = document.getElementById("food-name");
    if (foodNameInput) foodNameInput.value = resName;
  }
  if (resPhone) {
    state.reservation.phone = resPhone;
    state.foodOrder.phone = resPhone;
    const foodPhoneInput = document.getElementById("food-phone");
    if (foodPhoneInput) foodPhoneInput.value = resPhone;
  }
  if (resDate) {
    state.reservation.checkInDate = resDate;
    state.foodOrder.date = resDate;
    const foodDateInput = document.getElementById("food-date");
    if (foodDateInput) foodDateInput.value = resDate;
  }
}

// همگام‌سازی ورودی‌های فرم غذا با فرم اقامت
function syncFoodToReservationInputs() {
  const foodName = document.getElementById("food-name")?.value.trim() || state.foodOrder.name;
  const foodPhone = document.getElementById("food-phone")?.value.trim() || state.foodOrder.phone;
  const foodDate = document.getElementById("food-date")?.value || state.foodOrder.date;
  const foodDay = document.getElementById("food-day")?.value || state.foodOrder.dayOfWeek;
  const foodMeal = document.getElementById("food-meal")?.value || state.foodOrder.mealType;

  if (foodName) {
    state.foodOrder.name = foodName;
    state.reservation.name = foodName;
    const resNameInput = document.getElementById("res-name");
    if (resNameInput) resNameInput.value = foodName;
  }
  if (foodPhone) {
    state.foodOrder.phone = foodPhone;
    state.reservation.phone = foodPhone;
    const resPhoneInput = document.getElementById("res-phone");
    if (resPhoneInput) resPhoneInput.value = foodPhone;
  }
  if (foodDate) {
    state.foodOrder.date = foodDate;
  }
  if (foodDay) state.foodOrder.dayOfWeek = foodDay;
  if (foodMeal) state.foodOrder.mealType = foodMeal;
}

/**
 * تولید متن پیام یکپارچه نهایی (شامل اطلاعات اقامت + خوراک)
 */
function generateUnifiedOrderMessage() {
  const roomSelect = document.getElementById("res-room-select");
  const roomId = roomSelect ? roomSelect.value : state.selectedRoomId;
  const room = ROOMS.find(r => r.id === roomId) || ROOMS[0];

  const name = state.reservation.name || state.foodOrder.name || "مهمان گرامی";
  const phone = state.reservation.phone || state.foodOrder.phone || "";
  const checkIn = state.reservation.checkInDate;
  const checkOut = state.reservation.checkOutDate || addDaysToDateString(checkIn, state.reservation.nights);
  const nights = state.reservation.nights;
  const guests = state.reservation.guests;
  const roomTotal = nights * guests * room.price;

  // بخش غذا
  const selectedFoodIds = Object.keys(state.foodOrder.selectedDishes);
  let foodTotal = 0;
  let foodSectionText = "";

  if (selectedFoodIds.length > 0) {
    const dishesLines = selectedFoodIds.map((id, idx) => {
      const dish = FOOD_MENU.find(d => d.id === id);
      const qty = state.foodOrder.selectedDishes[id];
      const lineCost = dish ? dish.price * qty : 0;
      foodTotal += lineCost;
      const emoji = idx === 0 ? "🍲" : "🍛";
      return `  ${emoji} ${dish ? dish.name : id} × ${formatPersianNumber(qty)} پرس (${formatToman(lineCost)})`;
    }).join("\n");

    foodSectionText = 
`🍽️ سفارش خوراک و غذای سنتی:
• وعده غذایی: ${state.foodOrder.mealType || 'ناهار'}
• تاریخ وعده: ${formatPersianNumber(state.foodOrder.date || checkIn)} (روز ${state.foodOrder.dayOfWeek || 'جمعه'})
• غذاهای انتخابی:
${dishesLines}
• برآورد خوراک: ${formatToman(foodTotal)}`;
  } else {
    foodSectionText = 
`🍽️ سفارش خوراک:
• بدون سفارش غذای مازاد (فقط اقامت همراه با صبحانه محلی کامل)`;
  }

  const grandTotal = roomTotal + foodTotal;

  return `🔴 درخواست یکپارچه اقامت و خوراک - خانه برزک

👤 نام مهمان: ${name}
📞 شماره تماس: ${phone}

🏠 مشخصات اقامت:
• اتاق انتخابی: ${room.name}
• تاریخ ورود: ${formatPersianNumber(checkIn)}
• مدت اقامت: ${formatPersianNumber(nights)} شب (خروج: ${formatPersianNumber(checkOut)})
• تعداد نفرات: ${formatPersianNumber(guests)} نفر
• برآورد اقامت: ${formatToman(roomTotal)} (${formatPersianNumber(guests)} نفر × ${formatPersianNumber(nights)} شب با صبحانه محلی)

${foodSectionText}

💰 جمع کل برآورد نهایی: ${formatToman(grandTotal)}

⚠️ یادداشت: این پیام صرفاً پیش‌نویس درخواست اولیه است و پس از بررسی و هماهنگی با مدیریت اقامتگاه قطعی خواهد شد.
🔗 گروه رزرو خانه برزک: ${CONFIG.reservationGroupUrl}
#درخواست_رزرو_یکپارچه`;
}

// ۱۰. ثبت و ارسال درخواست یکپارچه از فرم اقامت
function submitReservationForm(e) {
  if (e) e.preventDefault();
  triggerHaptic('medium');
  syncReservationToFoodInputs();

  const name = state.reservation.name;
  const phone = state.reservation.phone;

  if (!name) {
    showToast("لطفاً نام و نام خانوادگی خود را وارد کنید.");
    document.getElementById("res-name")?.focus();
    return;
  }

  if (!phone || phone.length < 10) {
    showToast("لطفاً شماره تماس معتبر (موبایل) را وارد کنید.");
    document.getElementById("res-phone")?.focus();
    return;
  }

  const messageText = generateUnifiedOrderMessage();

  openMessagePreviewModal({
    title: "پیش‌نمایش درخواست یکپارچه",
    subtitle: "اطلاعات کامل اقامت و خوراک آماده ارسال به گروه رزرو خانه برزک است:",
    messageText: messageText,
    actionType: "unified"
  });
}

// ۱۱. رندر کردن و مدیریت منوی غذا
function renderFoodSection() {
  const banner = document.getElementById("food-linked-stay-banner");
  const bannerText = document.getElementById("food-linked-stay-text");
  const room = ROOMS.find(r => r.id === state.selectedRoomId) || ROOMS[0];

  if (banner && bannerText) {
    banner.style.display = "flex";
    bannerText.textContent = `🏡 در حال انتخاب غذای محلی همراه با اقامت در اتاق «${room.name}» (ورود: ${formatPersianNumber(state.reservation.checkInDate)})`;
  }

  // پر کردن خودکار فیلدهای نام، تلفن و تاریخ در فرم غذا
  const foodNameInput = document.getElementById("food-name");
  const foodPhoneInput = document.getElementById("food-phone");
  const foodDateInput = document.getElementById("food-date");

  if (foodNameInput && !foodNameInput.value && state.reservation.name) {
    foodNameInput.value = state.reservation.name;
  }
  if (foodPhoneInput && !foodPhoneInput.value && state.reservation.phone) {
    foodPhoneInput.value = state.reservation.phone;
  }
  if (foodDateInput && !foodDateInput.value && state.reservation.checkInDate) {
    foodDateInput.value = state.reservation.checkInDate;
  }

  const container = document.getElementById("dishes-list-container");
  if (!container) return;

  container.innerHTML = FOOD_MENU.map(dish => {
    const isSelected = !!state.foodOrder.selectedDishes[dish.id];
    const qty = state.foodOrder.selectedDishes[dish.id] || 1;

    return `
      <div class="dish-card ${isSelected ? 'selected' : ''}" id="dish-card-${dish.id}">
        <div class="dish-header">
          <div>
            <span class="dish-name">${dish.name}</span>
            <span class="badge badge-gold" style="font-size: 10px; margin-right: 6px;">${dish.category}</span>
          </div>
          <span class="dish-price">${dish.priceDisplay}</span>
        </div>
        <p class="dish-desc">${dish.description}</p>
        <div class="dish-selector-row">
          <label class="dish-checkbox-wrap">
            <input type="checkbox" id="check-${dish.id}" ${isSelected ? 'checked' : ''} onchange="toggleDishSelection('${dish.id}')" />
            <span>انتخاب این غذا</span>
          </label>
          ${isSelected ? `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 12px; color: var(--brand-text-muted);">تعداد:</span>
              <div class="stepper" style="padding: 2px;">
                <button type="button" class="stepper-btn" style="width: 28px; height: 28px; font-size: 15px;" onclick="changeDishQty('${dish.id}', -1)">-</button>
                <span style="min-width: 24px; text-align: center; font-weight: bold; font-size: 13px;">${formatPersianNumber(qty)}</span>
                <button type="button" class="stepper-btn" style="width: 28px; height: 28px; font-size: 15px;" onclick="changeDishQty('${dish.id}', 1)">+</button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join("");

  updateFoodOrderSummary();
}

// قانون سفارش: در هر وعده حداکثر ۱ نوع غذا، و در سفر گروهی حداکثر ۲ نوع غذا
function toggleDishSelection(dishId) {
  triggerHaptic('light');
  const currentSelectedKeys = Object.keys(state.foodOrder.selectedDishes);
  const maxAllowed = state.foodOrder.isGroupTravel ? 2 : 1;

  if (state.foodOrder.selectedDishes[dishId]) {
    delete state.foodOrder.selectedDishes[dishId];
  } else {
    if (currentSelectedKeys.length >= maxAllowed) {
      triggerHaptic('warning');
      if (maxAllowed === 1) {
        showToast("«در هر وعده امکان انتخاب یک نوع غذا وجود دارد. در صورت سفر گروهی، گزینه سفر گروهی را فعال کنید تا ۲ نوع غذا انتخاب نمایید.»");
      } else {
        showToast("«در سفر گروهی، در هر وعده حداکثر امکان انتخاب دو غذا وجود دارد.»");
      }
      const checkbox = document.getElementById(`check-${dishId}`);
      if (checkbox) checkbox.checked = false;
      return;
    }
    state.foodOrder.selectedDishes[dishId] = 1;
  }

  renderFoodSection();
  updateReservationCalculations();
}

// تغییر وضعیت انتخاب سفر گروهی (امکان انتخاب تا ۲ نوع غذا)
function toggleGroupTravel(isGroup) {
  triggerHaptic('light');
  state.foodOrder.isGroupTravel = !!isGroup;
  const currentKeys = Object.keys(state.foodOrder.selectedDishes);
  if (!isGroup && currentKeys.length > 1) {
    const toRemove = currentKeys.slice(1);
    toRemove.forEach(k => delete state.foodOrder.selectedDishes[k]);
    showToast("تعداد غذاها مطابق سفر غیرگروهی به یک نوع غذا تنظیم شد.");
  }
  renderFoodSection();
  updateReservationCalculations();
}

function changeDishQty(dishId, delta) {
  triggerHaptic('light');
  if (!state.foodOrder.selectedDishes[dishId]) return;
  let q = state.foodOrder.selectedDishes[dishId] + delta;
  if (q < 1) q = 1;
  if (q > 20) q = 20;
  state.foodOrder.selectedDishes[dishId] = q;
  renderFoodSection();
  updateReservationCalculations();
}

function updateFoodOrderSummary() {
  const summaryBox = document.getElementById("food-order-summary");
  if (!summaryBox) return;

  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length === 0) {
    summaryBox.innerHTML = `
      <div style="font-size: 12.5px; color: var(--brand-text-muted); text-align: center;">
        هنوز غذایی انتخاب نشده است. از منوی بالا ${state.foodOrder.isGroupTravel ? 'حداکثر ۲ نوع غذا' : 'یک نوع غذا'} را علامت بزنید.
      </div>
    `;
    return;
  }

  let totalSum = 0;
  const rows = selectedIds.map((id, index) => {
    const dish = FOOD_MENU.find(d => d.id === id);
    const qty = state.foodOrder.selectedDishes[id];
    const lineTotal = dish ? dish.price * qty : 0;
    totalSum += lineTotal;
    return `
      <div class="estimate-row">
        <span>🍲 غذای ${formatPersianNumber(index + 1)}: ${dish ? dish.name : id} × ${formatPersianNumber(qty)}</span>
        <span>${formatToman(lineTotal)}</span>
      </div>
    `;
  }).join("");

  summaryBox.innerHTML = `
    ${rows}
    <div class="estimate-row estimate-total">
      <span>مبلغ سفارش خوراک سنتی:</span>
      <span>${formatToman(totalSum)}</span>
    </div>
  `;
}

// ثبت یکجای سفارش اقامت و خوراک از صفحه غذا
function submitFoodOrderForm(e) {
  if (e) e.preventDefault();
  triggerHaptic('medium');
  syncFoodToReservationInputs();

  const name = state.foodOrder.name;
  const phone = state.foodOrder.phone;
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);

  if (!name) {
    showToast("لطفاً نام مهمان را وارد کنید.");
    document.getElementById("food-name")?.focus();
    return;
  }
  if (!phone || phone.length < 10) {
    showToast("لطفاً شماره تماس را وارد کنید.");
    document.getElementById("food-phone")?.focus();
    return;
  }
  if (selectedIds.length === 0) {
    showToast("لطفاً حداقل یک غذا از منو انتخاب کنید.");
    return;
  }

  updateReservationCalculations();
  const messageText = generateUnifiedOrderMessage();

  openMessagePreviewModal({
    title: "پیش‌نمایش درخواست یکپارچه",
    subtitle: "اطلاعات سفارش غذا به همراه اقامتگاه آماده ارسال به گروه رزرو است:",
    messageText: messageText,
    actionType: "unified"
  });
}

// ۱۲. مدال پیش‌نمایش و ارسال پیام به گروه رزرو
let currentModalMessage = "";

function openMessagePreviewModal({ title, subtitle, messageText, actionType }) {
  currentModalMessage = messageText;
  const titleEl = document.getElementById("modal-title");
  const subtitleEl = document.getElementById("modal-subtitle");
  const previewEl = document.getElementById("modal-message-preview");
  
  if (titleEl) titleEl.textContent = title;
  if (subtitleEl) subtitleEl.textContent = subtitle;
  if (previewEl) previewEl.textContent = messageText;
  
  const modal = document.getElementById("message-modal");
  if (modal) modal.classList.add("active");
}

function closeMessageModal() {
  triggerHaptic('light');
  const modal = document.getElementById("message-modal");
  if (modal) modal.classList.remove("active");
}

function copyModalMessage() {
  triggerHaptic('medium');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentModalMessage).then(() => {
      showToast("متن کامل درخواست با موفقیت کپی شد.");
    }).catch(() => {
      fallbackCopy(currentModalMessage);
    });
  } else {
    fallbackCopy(currentModalMessage);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast("متن درخواست کپی شد.");
  } catch (e) {
    showToast("امکان کپی خودکار فراهم نشد.");
  }
  document.body.removeChild(ta);
}

/**
 * ارسال هوشمند به گروه رزرو خانه برزک (از طریق ورکر، ربات یا لینک تلگرام)
 */
function sendViaTelegram() {
  triggerHaptic('medium');

  // تلاش برای ارسال از طریق Cloudflare Worker
  if (CONFIG.workerUrl) {
    showToast("در حال ارسال درخواست به گروه رزرو خانه برزک...");
    
    fetch(`${CONFIG.workerUrl}/api/reserve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "submit_reservation",
        isMiniAppOrder: true,
        message: currentModalMessage,
        initData: tg ? tg.initData : "",
        data: {
          reservation: state.reservation,
          foodOrder: state.foodOrder
        }
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.ok) {
        showToast("درخواست شما با موفقیت به گروه رزرو خانه برزک ارسال شد.");
        // در صورت اجرای درون تلگرام وب‌اپ با tg.sendData نیز به چت ارسال می‌شود
        if (tg && tg.sendData) {
          try { tg.sendData(currentModalMessage); } catch (e) {}
        }
        setTimeout(() => closeMessageModal(), 1500);
      } else {
        fallbackOpenTelegramGroup();
      }
    })
    .catch(err => {
      console.warn("Worker submission notice:", err);
      fallbackOpenTelegramGroup();
    });
    return;
  }

  fallbackOpenTelegramGroup();
}

/**
 * باز کردن مستقیم لینک اختصاصی گروه رزرو خانه برزک
 */
function sendDirectToReservationGroup() {
  triggerHaptic('medium');
  copyModalMessage();
  const groupUrl = CONFIG.reservationGroupUrl || "https://t.me/+wigY6VanuYplYTk8";

  showToast("متن درخواست کپی شد. در حال باز کردن گروه رزرو خانه برزک...");
  setTimeout(() => {
    if (tg && tg.openTelegramLink) {
      try {
        tg.openTelegramLink(groupUrl);
        closeMessageModal();
        return;
      } catch (e) {}
    }
    window.open(groupUrl, '_blank');
    closeMessageModal();
  }, 600);
}

function fallbackOpenTelegramGroup() {
  const groupUrl = CONFIG.reservationGroupUrl || "https://t.me/+wigY6VanuYplYTk8";
  
  if (tg && tg.sendData) {
    try {
      tg.sendData(currentModalMessage);
      showToast("درخواست شما با موفقیت ارسال گردید.");
      closeMessageModal();
      return;
    } catch (e) {}
  }

  copyModalMessage();
  showToast("متن درخواست کپی شد. گروه رزرو را باز کنید و ارسال فرمایید.");
  setTimeout(() => {
    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink(groupUrl);
    } else {
      window.open(groupUrl, '_blank');
    }
    closeMessageModal();
  }, 700);
}

// نمایش پیام Toast
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ۱۳. راه‌اندازی در هنگام بارگذاری صفحه (DOMContentLoaded)
document.addEventListener("DOMContentLoaded", () => {
  initTelegramWebApp();

  // مقداردهی اولیه فیلدها و تاریخ‌ها
  const checkInInput = document.getElementById("res-checkin-date");
  if (checkInInput) {
    checkInInput.value = state.reservation.checkInDate;
    checkInInput.min = getTodayFormattedDate();
    checkInInput.addEventListener("change", (e) => {
      state.reservation.checkInDate = e.target.value;
      updateReservationCalculations();
    });
  }

  const roomSelect = document.getElementById("res-room-select");
  if (roomSelect) {
    roomSelect.innerHTML = ROOMS.map(r => `
      <option value="${r.id}">اتاق ${r.name} - ظرفیت تا ${formatPersianNumber(r.capacity)} نفر (${formatToman(r.price)} / هر نفر شب با صبحانه)</option>
    `).join("");
    roomSelect.addEventListener("change", (e) => {
      state.selectedRoomId = e.target.value;
      updateReservationCalculations();
    });
  }

  const foodDateInput = document.getElementById("food-date");
  if (foodDateInput) {
    foodDateInput.value = state.foodOrder.date;
    foodDateInput.min = getTodayFormattedDate();
  }

  // اگر نام کاربر در تلگرام موجود بود، فیلدهای نام را پر می‌کنیم
  if (state.reservation.name) {
    const resNameEl = document.getElementById("res-name");
    const foodNameEl = document.getElementById("food-name");
    if (resNameEl) resNameEl.value = state.reservation.name;
    if (foodNameEl) foodNameEl.value = state.foodOrder.name;
  }

  // مقداردهی دکمه‌ها و لینک‌های خارجی از CONFIG
  document.querySelectorAll("[data-config-phone1]").forEach(el => {
    el.href = `tel:${CONFIG.phone1}`;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(`tel:${CONFIG.phone1}`);
    });
  });
  document.querySelectorAll("[data-config-phone2]").forEach(el => {
    el.href = `tel:${CONFIG.phone2}`;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(`tel:${CONFIG.phone2}`);
    });
  });
  document.querySelectorAll("[data-config-phone]").forEach(el => {
    el.href = `tel:${CONFIG.phone1}`;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(`tel:${CONFIG.phone1}`);
    });
  });
  document.querySelectorAll("[data-config-map]").forEach(el => {
    el.href = CONFIG.mapUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.mapUrl);
    });
  });
  document.querySelectorAll("[data-config-telegram]").forEach(el => {
    el.href = CONFIG.telegram;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.telegram);
    });
  });
  document.querySelectorAll("[data-config-instagram]").forEach(el => {
    el.href = CONFIG.instagram;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.instagram);
    });
  });
  document.querySelectorAll("[data-config-website]").forEach(el => {
    el.href = CONFIG.website;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.website);
    });
  });
  document.querySelectorAll("[data-config-weather]").forEach(el => {
    el.href = CONFIG.weatherUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.weatherUrl);
    });
  });
  document.querySelectorAll("[data-config-rooms-info]").forEach(el => {
    el.href = CONFIG.roomsInfoUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.roomsInfoUrl);
    });
  });
  document.querySelectorAll("[data-config-rules]").forEach(el => {
    el.href = CONFIG.rulesUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.rulesUrl);
    });
  });
  document.querySelectorAll("[data-config-green-travel]").forEach(el => {
    el.href = CONFIG.greenTravelUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.greenTravelUrl);
    });
  });
  document.querySelectorAll("[data-config-food-menu]").forEach(el => {
    el.href = CONFIG.foodMenuUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.foodMenuUrl);
    });
  });
  document.querySelectorAll("[data-config-google-reviews]").forEach(el => {
    el.href = CONFIG.googleMapsReviewUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.googleMapsReviewUrl);
    });
  });
  document.querySelectorAll("[data-config-tripadvisor]").forEach(el => {
    el.href = CONFIG.tripAdvisorUrl;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.tripAdvisorUrl);
    });
  });

  // اتصال مستقیم و مطمئن کلیک برای کارت‌های منوی اصلی صفحه نخست
  const navBindings = [
    { id: "menu-btn-rooms", screen: "screen-rooms" },
    { id: "menu-btn-address", screen: "screen-address" },
    { id: "menu-btn-contact", screen: "screen-contact" },
    { id: "menu-btn-social", screen: "screen-social" },
    { id: "menu-btn-rules", screen: "screen-rules" },
    { id: "menu-btn-weather", screen: "screen-weather" },
    { id: "menu-btn-green", screen: "screen-green-travel" },
    { id: "menu-btn-food", screen: "screen-food" },
    { id: "menu-btn-reviews", screen: "screen-reviews" }
  ];

  navBindings.forEach(({ id, screen }) => {
    const cardEl = document.getElementById(id);
    if (cardEl) {
      cardEl.style.cursor = "pointer";
      cardEl.setAttribute("role", "button");
      cardEl.setAttribute("tabindex", "0");
      cardEl.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo(screen);
      });
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateTo(screen);
        }
      });
    }
  });

  const websiteCard = document.getElementById("menu-btn-website");
  if (websiteCard) {
    websiteCard.style.cursor = "pointer";
    websiteCard.addEventListener("click", (e) => {
      e.preventDefault();
      openExternalUrl(CONFIG.website);
    });
  }

  // پر کردن متن آدرس و تلفن
  const addressTextEl = document.getElementById("display-house-address");
  if (addressTextEl) addressTextEl.textContent = CONFIG.address;

  const phone1TextEl = document.getElementById("display-house-phone-1");
  if (phone1TextEl) phone1TextEl.textContent = CONFIG.phone1Display;

  const phone2TextEl = document.getElementById("display-house-phone-2");
  if (phone2TextEl) phone2TextEl.textContent = CONFIG.phone2Display;

  const phoneTextEl = document.getElementById("display-house-phone");
  if (phoneTextEl) phoneTextEl.textContent = CONFIG.phone1Display;

  // رندر بخش‌ها
  renderRoomsList();
  renderFoodSection();
  updateReservationCalculations();
});

// اکسپورت توابع به پنجره سراسری (Global Window) برای دسترسی آسان در رویدادهای HTML
window.navigateTo = navigateTo;
window.navigateBack = navigateBack;
window.openExternalUrl = openExternalUrl;
window.openRoomDetail = openRoomDetail;
window.startReservationForCurrentRoom = startReservationForCurrentRoom;
window.changeReservationNights = changeReservationNights;
window.changeReservationGuests = changeReservationGuests;
window.submitReservationForm = submitReservationForm;
window.toggleDishSelection = toggleDishSelection;
window.toggleGroupTravel = toggleGroupTravel;
window.changeDishQty = changeDishQty;
window.submitFoodOrderForm = submitFoodOrderForm;
window.closeMessageModal = closeMessageModal;
window.copyModalMessage = copyModalMessage;
window.sendViaTelegram = sendViaTelegram;
window.showToast = showToast;
window.CONFIG = CONFIG;
window.ROOMS = ROOMS;
window.FOOD_MENU = FOOD_MENU;
