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
  telegramUsername: "barzokhouse",        // آیدی اکانت تلگرام خانه برزک
  telegramAccountUrl: "https://t.me/barzokhouse", // لینک مستقیم به اکانت تلگرام
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
  reservationGroupUrl: "https://web.telegram.org/k/#-4485664573",
  reservationGroupId: "-1004485664573",
  reservationGroupRawId: "-4485664573",
  reservationGroupDeepLink: "https://t.me/c/4485664573",
  reservationGroupInviteUrl: "https://t.me/+wigY6VanuYplYTk8",
  // آدرس Cloudflare Worker برای پردازش درخواست و ارسال مستقیم به گروه تلگرام
  workerUrl: "https://barzokhousereservationminiapp.targol.workers.dev"
};

// ۲. اطلاعات اتاق‌ها (Rooms Data)
const ROOMS = [
  {
    id: "shatoot",
    name: "شاتوت",
    capacity: 2,
    shortCapacity: "۲ نفر + ۱ نفر اضافه",
    mainCapacity: "یک تخت دو نفره",
    extraCapacity: "۱ نفر ظرفیت اضافه رختخواب سنتی",
    capacityDisplay: "یک تخت دو نفره و ۱ نفر ظرفیت اضافه رختخواب سنتی",
    beds: "یک تخت دو نفره + ۱ نفر ظرفیت اضافه رختخواب سنتی",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر/شب",
    description: "واقع در خانه جدید و کنار اتاق قالی قرار دارد. در اتاق رو به درخت شاتوت کهنسال حیاط باز می‌شود. اتاق پنجره ندارد، اما تاریک هم نیست.",
    amenities: [
      "یک تخت دو نفره",
      "سرویس بهداشتی ایرانی",
      "حمام اختصاصی",
      "بخاری گازی",
      "پنکه دیواری",
      "وای‌فای",
      "صبحانه محلی"
    ],
    images: ["./assets/rooms/shatoot.webp"]
  },
  {
    id: "ghaali",
    name: "قالی",
    capacity: 3,
    shortCapacity: "۳ نفر + ۱ نفر اضافه",
    mainCapacity: "یک تخت دو نفره و یک تخت یک نفره",
    extraCapacity: "۱ نفر ظرفیت اضافه رختخواب سنتی",
    capacityDisplay: "یک تخت دو نفره و یک تخت یک نفره و ۱ نفر ظرفیت اضافه رختخواب سنتی",
    beds: "یک تخت دو نفره و یک تخت یک نفره + ۱ نفر ظرفیت اضافه رختخواب سنتی",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر/شب",
    description: "واقع در خانه جدید و کنار اتاق شاتوت قرار دارد. این اتاق، اتاق قالیبافون خونه بوده که حال و هوای جذابی دارد. با یک پنجره در ارتفاع به حیاط فضای روشنی دارد.",
    amenities: [
      "یک تخت دو نفره و یک تخت یک نفره",
      "سرویس بهداشتی فرنگی",
      "حمام اختصاصی",
      "بخاری گازی",
      "پنکه دیواری",
      "وای‌فای",
      "صبحانه محلی"
    ],
    images: ["./assets/rooms/ghaali.webp"]
  },
  {
    id: "abi",
    name: "آبی",
    capacity: 2,
    shortCapacity: "۲ نفر (رختخواب سنتی)",
    mainCapacity: "۲ نفر (رختخواب سنتی)",
    extraCapacity: "",
    capacityDisplay: "۲ نفر (رختخواب سنتی)",
    beds: "۲ نفر (رختخواب سنتی)",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر/شب",
    description: "اتاقی با سقف بلند با دیوارهای آبی به یاد اتاق آبی سهراب سپهری. این اتاق با اولین اشعه خورشید روشن می‌شود. این اتاق پنجره‌هایی بلند رو به کوچه بن‌بست دارد.",
    amenities: [
      "نورگیر با پنجره‌های بلند",
      "سرویس بهداشتی ایرانی",
      "حمام اختصاصی",
      "بخاری گازی",
      "کرسی سنتی",
      "پنکه ایستاده",
      "وای‌فای",
      "صبحانه محلی"
    ],
    images: ["./assets/rooms/abi.webp"]
  },
  {
    id: "sara",
    name: "سرا",
    capacity: 10,
    shortCapacity: "۳ نفر + تا ۷ نفر اضافه",
    mainCapacity: "یک تخت دو نفره و یک تخت یک نفره",
    extraCapacity: "تا ۷ نفر ظرفیت اضافه رختخواب سنتی",
    capacityDisplay: "یک تخت دو نفره و یک تخت یک نفره و تا ۷ نفر ظرفیت اضافه رختخواب سنتی",
    beds: "یک تخت دو نفره و یک تخت یک نفره + تا ۷ نفر رختخواب سنتی",
    price: 1300000,
    priceDisplay: "۱,۳۰۰,۰۰۰ تومان",
    priceNote: "هر نفر/شب",
    description: "بزرگ‌ترین فضای خانه با سه اتاق تو در تو که یک اتاق با نردبان در دسترس است. سقف گنبدی و خشتی این اتاق از زمان صفویه به جای مانده است. این اتاق پنجره ندارد اما یکی از فضاها روشن است و دو فضای دیگر شما را در تاریکی آرامش‌بخش خلسه‌گونه‌ای در تمام روز به دور از هیاهو و آنتن موبایلتان پذیرا است.",
    amenities: [
      "یک تخت دو نفره و یک تخت یک نفره",
      "سرویس بهداشتی فرنگی",
      "حمام اختصاصی",
      "بخاری هیزمی",
      "بخاری برقی",
      "بخاری گازی",
      "کرسی سنتی",
      "وای‌فای",
      "صبحانه محلی"
    ],
    images: ["./assets/rooms/sara.webp"]
  },
  {
    id: "balakhoneh",
    name: "بالاخونه",
    capacity: 3,
    shortCapacity: "۳ نفر + ۱ نفر اضافه",
    mainCapacity: "سه نفر رختخواب سنتی",
    extraCapacity: "۱ نفر ظرفیت اضافه رختخواب سنتی",
    capacityDisplay: "سه نفر رختخواب سنتی و یک نفر ظرفیت اضافه رختخواب سنتی",
    beds: "سه نفر رختخواب سنتی و یک نفر ظرفیت اضافه رختخواب سنتی",
    price: 1200000,
    priceDisplay: "۱,۲۰۰,۰۰۰ تومان",
    priceNote: "هر نفر/شب",
    description: "این اتاق در طبقه بالا قرار دارد و پله‌هایی باریک و بلند دارد که برای همه توصیه نمی‌شود. اما اگر به منظره و هوای تازه علاقمندید، این اتاق برای شماست.",
    amenities: [
      "سه نفر رختخواب سنتی",
      "سرویس بهداشتی ایرانی و فرنگی عمومی در حیاط",
      "حمام غیر اختصاصی در حیاط",
      "بخاری گازی",
      "پنکه ایستاده",
      "وای‌فای",
      "صبحانه محلی"
    ],
    images: ["./assets/rooms/balakhoneh.webp"]
  }
];

// ۳. منوی غذاهای محلی (Food Menu Data) - برگرفته از منوی کامل خانه برزک در denu.app
const FOOD_MENU = [
  {
    "id": "63fb20513c3a63646b47849d",
    "name": "گوشت لوبیا کاشان (غذای اصیل سنتی)",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 900000,
    "priceDisplay": "۹۰۰,۰۰۰ تومان",
    "description": "خوراک سنتی گوشت گوسفندی پخته‌شده با لوبیای سفید با دارچین فراوان همراه با شوید پلو",
    "ingredients": [
      "گوشت گوسفندی",
      "لوبیا سفید",
      "دارچین",
      "شوید پلو"
    ],
    "image": "https://storage.denu.app/storage/00b/761/00b761b3dc115eb8f8630ac3738eda7d12504805c8e7920c410d328c746c9574.jpg"
  },
  {
    "id": "63fb20453c3a63646b47849c",
    "name": "ته چین گوشت و قارچ",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 900000,
    "priceDisplay": "۹۰۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های گوشت چرخ کرده گوسفند، قارچ، رب گوجه‌فرنگی و برنج اعلای ایرانی",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "قارچ",
      "رب گوجه‌فرنگی",
      "برنج ایرانی",
      "ماست",
      "تخم مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/787/360/78736017d582eebc0f8d5b7d310ba54fae9a3048f0f2c4e832d9563936b0b31d.jpg"
  },
  {
    "id": "63fb5abd3c3a63646b4784d0",
    "name": "ته‌چین گوشت و بادمجان",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 900000,
    "priceDisplay": "۹۰۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های گوشت چرخ کرده گوسفند، بادمجان، رب گوجه‌فرنگی و برنج اعلای ایرانی",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "بادمجان",
      "رب گوجه‌فرنگی",
      "برنج ایرانی",
      "ماست",
      "تخم مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/f27/4e6/f274e6886f8890e6bce2dcd92d242c40027c8a76d67489348e2de784c4544977.jpg"
  },
  {
    "id": "63fb7a0b3c3a63646b478504",
    "name": "ته‌چین گوشت و اسفناج",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 900000,
    "priceDisplay": "۹۰۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های گوشت چرخ‌کرده گوسفند، اسفناج، برنج ایرانی و برنج اعلای ایرانی",
    "ingredients": [
      "گوشت چرخ‌کرده گوسفند",
      "اسفناج",
      "برنج ایرانی",
      "ماست",
      "تخم مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/0d3/6e0/0d36e053b8473e1c288210e721f6b97a03f33699e6f3c2291d69ede7c9940241.jpg"
  },
  {
    "id": "63fb7a7d3c3a63646b478505",
    "name": "مرغ و هویج و آلو",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "خوراک لذیذ مرغ همراه با خلال هویج، آلو بخارای شیرین و ملس و رب گوجه فرنگی با پلو",
    "ingredients": [
      "مرغ",
      "هویج",
      "آلو بخارا",
      "رب گوجه فرنگی",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/752/85c/75285cb699c0107b7c65ebf38c9b4e84d3689583cdc65fb81d6decd0a1735356.jpg"
  },
  {
    "id": "63fb7a9d3c3a63646b478506",
    "name": "مرغ کاری",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "مرغ طعم‌دار شده با ماست محلی و ادویه معطر کاری همراه با برنج ایرانی",
    "ingredients": [
      "مرغ",
      "ماست",
      "ادویه کاری",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/21d/88c/21d88c2473347998a13f09606766f24c9267baad51ae703720eecdc237511582.jpg"
  },
  {
    "id": "6757294b8ac6754eb7e807b2",
    "name": "شاتوت پلو",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 900000,
    "priceDisplay": "۹۰۰,۰۰۰ تومان",
    "description": "شاتوت تازه باغات برزک همراه با گوشت گوسفندی، رب انار و پلوی زعفرانی اصیل ایرانی",
    "ingredients": [
      "شاتوت",
      "گوشت گوسفندی",
      "رب انار",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/e28/3cf/e283cfbdf91d6fbe34015f49eb06d91b4542d37df8cf386bd47d4999d163cb13.jpg"
  },
  {
    "id": "63fb7b3a3c3a63646b478508",
    "name": "دیزی پلو",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "پلوی لذیذ دم‌پخت شده با گوشت گوسفندی تازه و لوبیای چشم بلبلی",
    "ingredients": [
      "گوشت گوسفندی",
      "لوبیا چشم بلبلی",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/2e4/769/2e476969888d45db1891d841cb969a769ba0d55ecbf508bbe9f0431172aa3162.jpg"
  },
  {
    "id": "63fb7b583c3a63646b478509",
    "name": "لوبیا پلو",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "لوبیا پلوی مجلسی با گوشت تکه‌ای گوسفندی، لوبیا سبز تازه و ادویه‌جات معطر",
    "ingredients": [
      "لوبیا سبز",
      "گوشت گوسفندی",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/3a9/0b2/3a90b23fdadd48d30a93d969c9d36ce556ba07719a1ca2b8f18f0ae697d9974c.jpg"
  },
  {
    "id": "63fb7b823c3a63646b47850a",
    "name": "تاس کباب",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "تاس‌کباب سنتی با گوشت گوسفندی، بادمجان، گوجه فرنگی، پیاز و سس رب انار ملس همراه با پلو",
    "ingredients": [
      "گوشت گوسفندی",
      "بادمجان",
      "گوجه فرنگی",
      "پیاز",
      "رب انار",
      "پلو"
    ],
    "image": "https://storage.denu.app/storage/4e5/7f0/4e57f0f6649ccc2ff082e8aad3e885aeb172851b52a7b5b1563188915f629819.jpg"
  },
  {
    "id": "679ca48f4b05bf6713eeaae0",
    "name": "دمپخت",
    "category": "خوراک‌های گوشتی با برنج",
    "tags": [
      "همراه با برنج",
      "گوشتی"
    ],
    "price": 500000,
    "priceDisplay": "۵۰۰,۰۰۰ تومان",
    "description": "دمپخت لذیذ با گوشت چرخ‌کرده گوسفند، سبزیجات تازه محلی کوهستان و برنج ایرانی",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "سبزیجات محلی",
      "برنج ایرانی"
    ],
    "image": ""
  },
  {
    "id": "64240e4b3c3a63646b4787a1",
    "name": "تاس‌کباب",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "تاس‌کباب اصیل گوسفندی با بادمجان و گوجه فرنگی و چاشنی رب انار همراه با نان خشک محلی",
    "ingredients": [
      "گوشت گوسفندی",
      "بادمجان",
      "پیاز",
      "گوجه‌فرنگی",
      "رب انار"
    ],
    "image": "https://storage.denu.app/storage/427/df5/427df5b3b0341de8e0b9ec775734694ab300b77caabed92ee4cf5c5286981440.jpg"
  },
  {
    "id": "63fb7c753c3a63646b47850c",
    "name": "قیمه ریزه سیب زمینی",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "کوفته ریزه‌های گوسفندی با سیب‌زمینی و سس رب گوجه‌فرنگی همراه با نان خشک محلی",
    "ingredients": [
      "گوشت چرخ‌کرده گوسفند",
      "سیب زمینی",
      "رب گوجه فرنگی",
      "نان خشک محلی"
    ],
    "image": "https://storage.denu.app/storage/ae4/4b1/ae44b120392b83c1df47f01b08f42fb5f23ee23ff397d0c5d94b3e4c45446b17.jpg"
  },
  {
    "id": "63fb7ca63c3a63646b47850d",
    "name": "قیمه ریزه بادمجان",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "کوفته ریزه‌های خوش‌طعم گوسفندی با بادمجان سرخ‌شده و سبزی خشک معطر همراه با نان محلی",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "بادمجان",
      "رب گوجه فرنگی",
      "سبزی خشک",
      "نان خشک محلی"
    ],
    "image": "https://storage.denu.app/storage/3e5/242/3e5242e4ff1f7091d9305725b50771aa33ce618a71c9c678399c9a628a9e9385.jpg"
  },
  {
    "id": "63fb7ccb3c3a63646b47850e",
    "name": "شفته آب انار",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "کوفته شفته سنتی برزک و کاشان تهیه شده با گوشت گوسفند و سس ترش و ملس آب انار",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "رب انار",
      "نان خشک محلی"
    ],
    "image": "https://storage.denu.app/storage/c99/538/c99538d367163a8fa3f96b7b2a88659dbef9a597a451b4bb2fc1ff9c5399aba9.jpg"
  },
  {
    "id": "63fb7d363c3a63646b478510",
    "name": "آبگوشت گوشت و نخود و لوبیا",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "آبگوشت اصیل سنتی با گوشت گوسفندی، نخود، لوبیا سفید و سیب‌زمینی در دیزی همراه با نان خشک محلی",
    "ingredients": [
      "گوشت گوسفندی",
      "نخود",
      "لوبیا سفید",
      "سیب زمینی",
      "رب گوجه فرنگی",
      "نان خشک محلی"
    ],
    "image": "https://storage.denu.app/storage/217/ad4/217ad4a9852ee219b4e0c2048c697f47e59d719281f6a296ad61ef91c3a0c997.jpg"
  },
  {
    "id": "63fb7d5d3c3a63646b478511",
    "name": "گوشت و عدس و بادمجان",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "خوراک مقوی و اصیل گوشت گوسفندی پخته شده با عدس، بادمجان، کشک محلی و پیازداغ",
    "ingredients": [
      "گوشت گوسفندی",
      "عدس",
      "بادمجان",
      "کشک",
      "پیاز داغ"
    ],
    "image": "https://storage.denu.app/storage/034/50a/03450ae2ca0e2c2e6e89d13e9bce9b1f2b7e6f1141d52a9a1217c3bf6d007c45.jpg"
  },
  {
    "id": "63fb7d863c3a63646b478512",
    "name": "کتلت",
    "category": "خوراک‌های گوشتی با نان",
    "tags": [
      "نانی",
      "گوشتی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "کتلت سنتی برشته و خانگی تهیه شده از گوشت چرخ‌کرده خالص گوسفندی و سیب‌زمینی",
    "ingredients": [
      "گوشت چرخ کرده گوسفند",
      "سیب زمینی",
      "تخم مرغ"
    ],
    "image": "https://storage.denu.app/storage/60c/58e/60c58ebbfe49907f6dcd40b0a62ca33c8bd94573bd4af56c0204e6c27115435c.jpg"
  },
  {
    "id": "63fb7e5f3c3a63646b478515",
    "name": "ته‌چین قارچ و بادمجان",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های قارچ، بادمجان، رب گوجه فرنگی و برنج اعلای ایرانی",
    "ingredients": [
      "قارچ",
      "بادمجان",
      "رب گوجه فرنگی",
      "برنج ایرانی",
      "ماست",
      "تخم مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/7c9/120/7c9120821a03b5b6fbc43e1ee67b6d84f0ccbbbb45363cd631c5166170c8243e.jpg"
  },
  {
    "id": "63fb7e953c3a63646b478516",
    "name": "ته‌چین قارچ و اسفناج",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های قارچ، اسفناج، رب گوجه فرنگی و برنج اعلای ایرانی",
    "ingredients": [
      "قارچ",
      "اسفناج",
      "رب گوجه فرنگی",
      "برنج ایرانی",
      "ماست",
      "تخم مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/360/911/36091188a695e689b4bd06ff460c050636fe034f72d83d6ff9d846d8bf18e747.jpg"
  },
  {
    "id": "642428753c3a63646b4787a2",
    "name": "ته‌چین قارچ و سویا",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 750000,
    "priceDisplay": "۷۵۰,۰۰۰ تومان",
    "description": "ته‌چین زعفرانی برشته با لایه‌های قارچ، سویا، رب گوجه‌فرنگی و برنج اعلای ایرانی",
    "ingredients": [
      "قارچ",
      "سویا",
      "رب گوجه‌فرنگی",
      "برنج",
      "ماست",
      "تخم‌مرغ",
      "زعفران"
    ],
    "image": "https://storage.denu.app/storage/74e/fd1/74efd1bfec1c43b5a03699016dfac46c09860d35453959c431f392290d6032b2.jpg"
  },
  {
    "id": "63fb20033c3a63646b478499",
    "name": "رشته پلو‍",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "رشته‌پلو خانگی با بادمجان، گوجه‌فرنگی تازه و برنج اصیل ایرانی",
    "ingredients": [
      "گوجه فرنگی",
      "بادمجان",
      "رشته خانگی ",
      "برنج ایرانی"
    ],
    "image": "https://storage.denu.app/storage/d38/e21/d38e21a18364de02467b64f74c3f4f36981a5a996c6beb4bd91732573ae79107.jpg"
  },
  {
    "id": "63fb7dd53c3a63646b478513",
    "name": "لوبیا پلو",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "خوراک سنتی خانگی تهیه شده از مواد اولیه تازه و محلی برزک",
    "ingredients": [
      "لوبیا سبز",
      "سویا",
      "برنج ایرانی"
    ],
    "image": "https://storage.denu.app/storage/a71/45b/a7145b8347fd4704b5d2ff23a9db5e85534f4b8532712ec4e147b717ec9982d7.jpg"
  },
  {
    "id": "63fb201b3c3a63646b47849a",
    "name": "کشک بادمجان",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 450000,
    "priceDisplay": "۴۵۰,۰۰۰ تومان",
    "description": "بادمجان کبابی و سرخ‌شده با کشک محلی گوسفندی، نعناع‌داغ، سیرداغ و پیازداغ عسلی",
    "ingredients": [
      "بادمجان",
      "کشک",
      "پیاز داغ",
      "نعنا داغ",
      "سیرداغ"
    ],
    "image": "https://storage.denu.app/storage/ea4/542/ea4542079b7182af324337f96463da8453cf458a09e180294d484fc84d53f272.jpg"
  },
  {
    "id": "63fb7e0a3c3a63646b478514",
    "name": "کالجوش",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 360000,
    "priceDisplay": "۳۶۰,۰۰۰ تومان",
    "description": "کالجوش سنتی با کشک محلی اعلا، پیازداغ، نعناع‌داغ و مغز گردوی باغات برزک همراه با نان خشک",
    "ingredients": [
      "کشک",
      "پیاز داغ",
      "نعنا داغ",
      "گردو",
      "نان خشک محلی"
    ],
    "image": "https://storage.denu.app/storage/62c/558/62c558755f61ab51ae530cb7ed078888051feb97a468d23e504c3e6b8718daf4.jpg"
  },
  {
    "id": "63fb7ee83c3a63646b478517",
    "name": "یتیمچه",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 420000,
    "priceDisplay": "۴۲۰,۰۰۰ تومان",
    "description": "خوراک گیاهی سنتی و سبک با بادمجان، کدو سبز، سیب‌زمینی، گوجه‌فرنگی تازه و سیر",
    "ingredients": [
      "بادمجان",
      "کدو سبز",
      "سیب زمینی",
      "گوجه فرنگی",
      "سیر",
      "پیاز"
    ],
    "image": "https://storage.denu.app/storage/503/2e7/5032e76e63e32bcef7188a8e67427436b393b61a4fe9c643ad22018f96168cc7.jpg"
  },
  {
    "id": "63fb7f183c3a63646b478519",
    "name": "کوکو سیب زمینی",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 400000,
    "priceDisplay": "۴۰۰,۰۰۰ تومان",
    "description": "کوکوی خانگی و تازه تهیه شده از مواد اولیه محلی و تازه برزک",
    "ingredients": [],
    "image": "https://storage.denu.app/storage/87a/44a/87a44aee661db6a5c4e0974f640f3ad65cc8442bb9401b69f06163ee9587004e.jpg"
  },
  {
    "id": "63fb7f213c3a63646b47851a",
    "name": "کوکوسبزی",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 400000,
    "priceDisplay": "۴۰۰,۰۰۰ تومان",
    "description": "کوکوی خانگی و تازه تهیه شده از مواد اولیه محلی و تازه برزک",
    "ingredients": [],
    "image": "https://storage.denu.app/storage/6c7/4d7/6c74d785c66d583b83daa4a4a4744b732b28c9cf252b8d101787afca6ea693c8.jpg"
  },
  {
    "id": "640b590c3c3a63646b4785d7",
    "name": "اشکنه سیب زمینی (دوپیازه آلو)",
    "category": "خوراک‌های گیاهی با نان",
    "tags": [
      "نانی",
      "گیاهی"
    ],
    "price": 250000,
    "priceDisplay": "۲۵۰,۰۰۰ تومان",
    "description": "اشکنه سیب‌زمینی سنتی (دوپیازه آلو) با پیازداغ فراوان، سیب‌زمینی و رب گوجه‌فرنگی خانگی",
    "ingredients": [
      "سیب زمینی",
      "پیاز داغ",
      "رب گوجه فرنگی"
    ],
    "image": "https://storage.denu.app/storage/af2/a47/af2a47401e87dab1d2290eed32634b24709b47d02e3ff8d97543e62aba084f3c.jpg"
  },
  {
    "id": "64242ab23c3a63646b4787a5",
    "name": "چلو",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 250000,
    "priceDisplay": "۲۵۰,۰۰۰ تومان",
    "description": "برنج درجه یک ایرانی دم‌کشیده با کره محلی و زعفران",
    "ingredients": [],
    "image": "https://storage.denu.app/storage/5bb/c20/5bbc207f574dbbce3763f0b7359b5a5a0b858be453a9c4ae4fbb81de129ef142.jpg"
  },
  {
    "id": "679ca45f4b05bf6713eeaadf",
    "name": "دمپخت",
    "category": "خوراک‌های گیاهی با برنج",
    "tags": [
      "همراه با برنج",
      "گیاهی"
    ],
    "price": 550000,
    "priceDisplay": "۵۵۰,۰۰۰ تومان",
    "description": "دمپخت گیاهی مقوی با سبزیجات تازه محلی برزک و برنج ایرانی",
    "ingredients": [
      "سبزیجات محلی",
      "برنج ایرانی"
    ],
    "image": ""
  },
  {
    "id": "63fb7f8d3c3a63646b47851c",
    "name": "آش رشته",
    "category": "آش و سوپ",
    "tags": [
      "آش و سوپ",
      "گیاهی"
    ],
    "price": 350000,
    "priceDisplay": "۳۵۰,۰۰۰ تومان",
    "description": "آش رشته سنتی جاافتاده با حبوبات تازه، سبزی محلی و کشک و پیازداغ فراوان",
    "ingredients": [],
    "image": "https://storage.denu.app/storage/ffa/1a5/ffa1a597f9477434fe546fd226e2b3d64b1c27c984e24f3081d57a570bde0f8d.jpg"
  },
  {
    "id": "63fb7fb73c3a63646b47851d",
    "name": "آش برنج",
    "category": "آش و سوپ",
    "tags": [
      "آش و سوپ",
      "گیاهی"
    ],
    "price": 350000,
    "priceDisplay": "۳۵۰,۰۰۰ تومان",
    "description": "آش برنج محلی مقوی با برنج، عدس، لپه، زرشک کوهی و بادام",
    "ingredients": [
      "برنج",
      "عدس",
      "لپه",
      "زرشک",
      "بادام"
    ],
    "image": "https://storage.denu.app/storage/21d/f20/21df20337f321d54313e1646cb355bc13da9dbf8721beaf073046fcd6b39ebfd.jpg"
  },
  {
    "id": "63fb7fe53c3a63646b47851e",
    "name": "سوپ شیر",
    "category": "آش و سوپ",
    "tags": [
      "آش و سوپ",
      "گوشتی"
    ],
    "price": 320000,
    "priceDisplay": "۳۲۰,۰۰۰ تومان",
    "description": "سوپ شیر لذیذ و لطیف با گوشت مرغ، خلال هویج، ذرت شیرین و سبزی خشک کوهی",
    "ingredients": [
      "مرغ",
      "هویج",
      "ذرت",
      "شیر",
      "سبزی خشک"
    ],
    "image": "https://storage.denu.app/storage/5f3/fb4/5f3fb4e08b96eecdcdd2b742606e0448f845df8613fb0d53a5ad72a9051ec005.jpg"
  },
  {
    "id": "63fb5eb53c3a63646b4784ed",
    "name": "صبحانه",
    "category": "صبحانه",
    "tags": [
      "صبحانه سنتی",
      "نانی"
    ],
    "price": 250000,
    "priceDisplay": "۲۵۰,۰۰۰ تومان",
    "description": "صبحانه کامل روستایی: نان گرم، پنیر محلی، کره محلی، انواع مربای خانگی، نیمرو تازه و حلوا ارده",
    "ingredients": [
      "نان",
      "پنیر",
      "کره محلی",
      "انواع مربا",
      "نیمرو",
      "حلوا ارده"
    ],
    "image": "https://storage.denu.app/storage/255/b53/255b53de74fc749669728e41479563f948371ba435cca881a730be9e7cc4b9d4.jpg"
  }
];

// ۴. وضعیت کلی برنامه (App State)
const state = {
  screenStack: ["screen-home"], // پشته صفحات برای بازگشت سلسله‌مراتبی
  selectedRoomId: "shatoot",
  reservationSourceScreen: "screen-rooms", // صفحه منبع ورود به رزرو (برای بازگشت دقیق)
  foodReturnToReservation: false, // آیا ورود به صفحه غذا از فرم رزرو اقامت بوده است؟
  foodCategoryFilter: "all", // فیلتر دسته‌بندی خوراک‌ها ('all' یا نام دسته‌بندی)
  foodSearchQuery: "", // متن جستجوی خوراک‌ها
  expandedFoodIds: {}, // لیست خوراک‌های بازشده در آکاردئون: { [dishId]: true }
  allFoodExpanded: false, // آیا تمام خوراک‌ها باز هستند؟
  reservation: {
    selectedRoomIds: ["shatoot"], // لیست شناسه‌های اتاق‌های انتخاب شده برای رزرو
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
    selectedDishes: {},
    // برنامه وعده‌های چندگانه (برای چند روز یا چند وعده در روز یا صبحانه‌های مستقل):
    scheduledMeals: []
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

// ۶. مدیریت Navigation و بازگشت یکپارچه بر پایه سلسله‌مراتب صفحات (Hierarchical SPA Navigation)
// مطابق دستور کاربر: دکمه بازگشت بر اساس ساختار درختی مینی‌اپ عمل می‌کند، نه گردش تاریخی تصادفی
const SCREEN_HIERARCHY = {
  "screen-rooms": () => "screen-home",
  "screen-room-detail": () => "screen-rooms",
  "screen-reservation": () => {
    if (state.reservationSourceScreen === "screen-room-detail") {
      return "screen-room-detail";
    }
    return "screen-rooms";
  },
  "screen-food": () => {
    if (state.foodReturnToReservation) {
      return "screen-reservation";
    }
    return "screen-home";
  },
  "screen-address": () => "screen-home",
  "screen-contact": () => "screen-home",
  "screen-social": () => "screen-home",
  "screen-rules": () => "screen-home",
  "screen-weather": () => "screen-home",
  "screen-green-travel": () => "screen-home",
  "screen-reviews": () => "screen-home",
};

function updateScreenStackFor(screenId) {
  if (screenId === "screen-home") {
    state.screenStack = ["screen-home"];
  } else if (screenId === "screen-rooms") {
    state.screenStack = ["screen-home", "screen-rooms"];
  } else if (screenId === "screen-room-detail") {
    state.screenStack = ["screen-home", "screen-rooms", "screen-room-detail"];
  } else if (screenId === "screen-reservation") {
    if (state.reservationSourceScreen === "screen-room-detail") {
      state.screenStack = ["screen-home", "screen-rooms", "screen-room-detail", "screen-reservation"];
    } else {
      state.screenStack = ["screen-home", "screen-rooms", "screen-reservation"];
    }
  } else if (screenId === "screen-food") {
    if (state.foodReturnToReservation) {
      state.screenStack = ["screen-home", "screen-rooms", "screen-reservation", "screen-food"];
    } else {
      state.screenStack = ["screen-home", "screen-food"];
    }
  } else {
    state.screenStack = ["screen-home", screenId];
  }
}

function navigateTo(screenId, source = null) {
  triggerHaptic('light');
  const currentScreenId = state.screenStack[state.screenStack.length - 1] || "screen-home";
  if (currentScreenId === screenId) return;

  if (screenId === "screen-food") {
    if (source === "screen-reservation") {
      state.foodReturnToReservation = true;
    } else if (source === "screen-home" || !source) {
      state.foodReturnToReservation = false;
    }
  }

  if (screenId === "screen-reservation" && source) {
    state.reservationSourceScreen = source;
  }

  updateScreenStackFor(screenId);
  renderCurrentScreen();
}

function navigateBack() {
  triggerHaptic('light');
  const currentScreenId = state.screenStack[state.screenStack.length - 1] || "screen-home";
  if (currentScreenId === "screen-home") return;

  const getParent = SCREEN_HIERARCHY[currentScreenId];
  const targetParent = getParent ? getParent() : "screen-home";

  if (currentScreenId === "screen-food" && targetParent === "screen-reservation") {
    state.foodReturnToReservation = false;
  }

  updateScreenStackFor(targetParent);
  renderCurrentScreen();
}

function renderCurrentScreen() {
  const targetId = state.screenStack[state.screenStack.length - 1] || "screen-home";

  // مخفی کردن تمامی اسکرین‌ها و نمایش اسکرین فعال
  document.querySelectorAll(".screen").forEach(el => {
    el.classList.remove("active");
  });

  const activeEl = document.getElementById(targetId);
  if (activeEl) {
    activeEl.classList.add("active");
  }

  // مدیریت نوار شناور وضعیت رزرو (در کل مینی‌اپ)
  updateFloatingBookingBar();

  if (targetId === "screen-room-detail") {
    updateRoomDetailButtons();
  } else if (targetId === "screen-reservation") {
    renderSelectedRoomsInForm();
    updateReservationCalculations();
  } else if (targetId === "screen-rooms") {
    renderRoomsList();
  } else if (targetId === "screen-food") {
    renderFoodSection();
  }

  // مدیریت نمایش یا مخفی‌سازی دکمه Back بومی تلگرام
  if (tg && tg.BackButton) {
    if (state.screenStack.length > 1 && targetId !== "screen-home") {
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

  const selectedIds = state.reservation.selectedRoomIds || [];

  container.innerHTML = ROOMS.map(room => {
    const isSelected = selectedIds.includes(room.id);
    return `
      <div class="room-card" id="room-card-${room.id}" style="position: relative;">
        ${isSelected ? '<span class="room-card-selected-badge">✓ در لیست رزرو شما</span>' : ''}
        <div class="room-card-img-wrap">
          <img src="${room.images[0]}" alt="${room.name}" class="room-card-img" loading="lazy" onerror="if(!this.dataset.err){this.dataset.err='1';this.src='./assets/rooms/${room.id}.svg';}" />
          <span class="room-card-capacity">👥 ${room.shortCapacity || room.capacityDisplay}</span>
        </div>
        <div class="room-card-body">
          <div class="room-card-title-row">
            <h3 class="room-card-title">اتاق ${room.name}</h3>
            <span class="room-card-price">${formatToman(room.price)} <small style="font-size: 11px; font-weight: normal; color: var(--brand-text-muted);">/ هر نفر شب</small></span>
          </div>
          <button class="btn btn-outline" onclick="openRoomDetail('${room.id}')" style="margin-top: 8px;">
            مشاهده مشخصات و عکس‌های اتاق ←
          </button>
        </div>
      </div>
    `;
  }).join("");
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
  const detailCap = document.getElementById("detail-capacity");
  if (detailCap) {
    detailCap.textContent = room.mainCapacity || room.capacityDisplay || `تا ${formatPersianNumber(room.capacity)} نفر`;
  }
  const detailCapExtra = document.getElementById("detail-capacity-extra");
  if (detailCapExtra) {
    if (room.extraCapacity) {
      detailCapExtra.textContent = room.extraCapacity;
      detailCapExtra.style.display = "block";
    } else {
      detailCapExtra.textContent = "";
      detailCapExtra.style.display = "none";
    }
  }
  const detailBeds = document.getElementById("detail-beds");
  if (detailBeds) {
    detailBeds.textContent = room.beds;
  }
  const detailPrice = document.getElementById("detail-price");
  if (detailPrice) {
    detailPrice.innerHTML = `${formatToman(room.price)} <span class="spec-price-unit">هر نفر/شب</span>`;
  }
  const detailPriceNote = document.getElementById("detail-price-note");
  if (detailPriceNote) {
    detailPriceNote.style.display = "none";
  }
  const detailDesc = document.getElementById("detail-desc");
  if (detailDesc) {
    detailDesc.textContent = room.description;
  }

  // امکانات
  const amenitiesWrap = document.getElementById("detail-amenities");
  if (amenitiesWrap) {
    amenitiesWrap.innerHTML = room.amenities.map(a => `
      <span class="amenity-chip">✓ ${a}</span>
    `).join("");
  }

  // به‌روزرسانی وضعیت دکمه‌های این اتاق
  updateRoomDetailButtons();

  // هدایت به صفحه جزئیات اتاق
  navigateTo("screen-room-detail");
}

function updateRoomDetailButtons() {
  const roomId = state.selectedRoomId;
  const isAdded = state.reservation.selectedRoomIds && state.reservation.selectedRoomIds.includes(roomId);
  const btn = document.getElementById("btn-request-reservation");
  const optionsBox = document.getElementById("detail-room-options");

  if (btn) {
    if (isAdded) {
      btn.innerHTML = `✓ اتاق ${ROOMS.find(r => r.id === roomId)?.name || ''} در لیست رزرو شماست`;
      btn.classList.remove("btn-mustard");
      btn.classList.add("btn-primary");
    } else {
      btn.innerHTML = `رزرو این اتاق ←`;
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-mustard");
    }
  }

  if (optionsBox) {
    optionsBox.style.display = isAdded ? "flex" : "none";
  }
}

function handleRoomDetailBookingClick() {
  triggerHaptic('medium');
  const roomId = state.selectedRoomId;
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;

  if (!state.reservation.selectedRoomIds) {
    state.reservation.selectedRoomIds = [];
  }

  if (!state.reservation.selectedRoomIds.includes(roomId)) {
    state.reservation.selectedRoomIds.push(roomId);
    showToast(`اتاق ${room.name} به درخواست رزرو اضافه شد. می‌توانید در مینی‌اپ بگردید یا رزرو را نهایی کنید.`);
  } else {
    showToast(`اتاق ${room.name} در لیست رزرو شما قرار دارد.`);
  }

  updateRoomDetailButtons();
  updateFloatingBookingBar();
  renderRoomsList();
}

function startReservationForCurrentRoom() {
  handleRoomDetailBookingClick();
  openReservationScreen();
}

function openReservationScreen() {
  triggerHaptic('light');
  if (!state.reservation.selectedRoomIds || state.reservation.selectedRoomIds.length === 0) {
    if (state.selectedRoomId) {
      state.reservation.selectedRoomIds = [state.selectedRoomId];
    } else {
      state.reservation.selectedRoomIds = ["shatoot"];
    }
  }
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  navigateTo("screen-reservation");
}

function removeRoomFromReservation(roomId) {
  triggerHaptic('light');
  const room = ROOMS.find(r => r.id === roomId);
  if (state.reservation.selectedRoomIds) {
    state.reservation.selectedRoomIds = state.reservation.selectedRoomIds.filter(id => id !== roomId);
  }
  showToast(`اتاق ${room ? room.name : ''} از لیست رزرو حذف شد.`);
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  updateFloatingBookingBar();
  updateRoomDetailButtons();
  renderRoomsList();
}

function renderSelectedRoomsInForm() {
  const container = document.getElementById("res-selected-rooms-container");
  if (!container) return;

  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  if (selectedRooms.length === 0) {
    container.innerHTML = `
      <div class="selected-rooms-empty">
        <p style="font-size: 13px; color: var(--brand-text-muted); margin-bottom: 8px;">هنوز اتاقی به درخواست رزرو اضافه نشده است.</p>
        <button type="button" class="btn btn-mustard" style="font-size: 12.5px; padding: 7px 14px;" onclick="navigateTo('screen-rooms')">
          🏠 مشاهده و انتخاب اتاق‌ها
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = selectedRooms.map(room => `
    <div class="selected-room-chip">
      <div class="selected-room-info">
        <span class="selected-room-name">🏠 اتاق ${room.name}</span>
        <span class="selected-room-meta">${formatToman(room.price)} هر نفر/شب • ${room.capacityDisplay || `تا ${formatPersianNumber(room.capacity)} نفر`}</span>
      </div>
      <button type="button" class="selected-room-remove-btn" onclick="removeRoomFromReservation('${room.id}')" title="حذف این اتاق از رزرو">
        ✕
      </button>
    </div>
  `).join("");
}

function updateFloatingBookingBar() {
  const bar = document.getElementById("floating-booking-bar");
  if (!bar) return;

  const currentScreenId = state.screenStack[state.screenStack.length - 1];
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  if (selectedRooms.length > 0 && currentScreenId !== "screen-reservation") {
    bar.style.display = "flex";
    const count = selectedRooms.length;
    const roomNames = selectedRooms.map(r => r.name).join(" و ");
    const titleEl = document.getElementById("floating-booking-title");
    const subEl = document.getElementById("floating-booking-sub");
    if (titleEl) {
      titleEl.textContent = `${formatPersianNumber(count)} اتاق در درخواست رزرو (${roomNames})`;
    }
    if (subEl) {
      subEl.textContent = "برای مشاهده و ارسال نهایی کلیک کنید";
    }
  } else {
    bar.style.display = "none";
  }
}

// ۹. فرم و محاسبات درخواست رزرو یکپارچه (اقامت + خوراک)
function updateReservationCalculations() {
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

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

  // محاسبه مبلغ اقامت (پشتیبانی از تک اتاق یا چند اتاق)
  let roomEstimate = 0;
  if (selectedRooms.length === 1) {
    roomEstimate = state.reservation.nights * state.reservation.guests * selectedRooms[0].price;
  } else if (selectedRooms.length > 1) {
    const sumPrices = selectedRooms.reduce((sum, r) => sum + r.price, 0);
    const avgPrice = Math.round(sumPrices / selectedRooms.length);
    roomEstimate = state.reservation.nights * state.reservation.guests * avgPrice;
  }

  // محاسبه سفارش خوراک‌ها (شامل وعده‌های ثبت‌شده در برنامه و اقلام انتخابی جاری)
  let foodEstimate = 0;
  const scheduled = state.foodOrder.scheduledMeals || [];
  scheduled.forEach(m => {
    foodEstimate += m.subtotal;
  });

  const currentSelectedFoodIds = Object.keys(state.foodOrder.selectedDishes);
  currentSelectedFoodIds.forEach(id => {
    const dish = FOOD_MENU.find(d => d.id === id);
    const qty = state.foodOrder.selectedDishes[id] || 1;
    if (dish) foodEstimate += dish.price * qty;
  });

  const totalMealCount = scheduled.length + (currentSelectedFoodIds.length > 0 ? 1 : 0);
  const grandTotal = roomEstimate + foodEstimate;

  // به‌روزرسانی کارت تعاملی غذا در فرم رزرو
  const foodCard = document.getElementById("unified-food-card");
  const foodBadge = document.getElementById("unified-food-badge");
  const foodContent = document.getElementById("unified-food-content");

  if (foodCard && foodBadge && foodContent) {
    if (totalMealCount === 0) {
      foodCard.classList.remove("has-food");
      foodBadge.textContent = "بدون غذا";
      foodBadge.style.background = "var(--brand-surface-subtle)";
      foodBadge.style.color = "var(--brand-text-muted)";
      foodContent.innerHTML = `
        <p class="unified-food-empty">
          می‌توانید وعده‌های غذایی سنتی برزک (صبحانه سنتی، ناهار یا شام برای چند روز) را نیز به همین درخواست اضافه کنید تا تمام موارد به‌صورت یکجا ثبت شوند.
        </p>
        <button type="button" class="btn btn-outline" style="font-size: 13px; padding: 8px 14px;" onclick="navigateToFoodFromReservation()">
          + انتخاب غذاهای محلی یا صبحانه از منو
        </button>
      `;
    } else {
      foodCard.classList.add("has-food");
      foodBadge.textContent = `همراه با غذا (${formatPersianNumber(totalMealCount)} وعده)`;
      foodBadge.style.background = "var(--brand-teal-subtle)";
      foodBadge.style.color = "var(--brand-teal-dark)";

      let mealsSummaryHtml = "";
      if (scheduled.length > 0) {
        mealsSummaryHtml += scheduled.map((m, idx) => {
          const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
          const dishesNames = m.dishes.map(d => `${d.name} (${formatPersianNumber(d.quantity)} پرس)`).join("، ");
          return `
            <div class="unified-food-item">
              <span>${icon} وعده ${formatPersianNumber(idx + 1)} (${m.mealType} ${m.dayOfWeek}): ${dishesNames}</span>
              <span>${formatToman(m.subtotal)}</span>
            </div>
          `;
        }).join("");
      }

      if (currentSelectedFoodIds.length > 0) {
        const currentDishesNames = currentSelectedFoodIds.map(id => {
          const d = FOOD_MENU.find(x => x.id === id);
          return `${d ? d.name : id} (${formatPersianNumber(state.foodOrder.selectedDishes[id])} پرس)`;
        }).join("، ");
        const icon = state.foodOrder.mealType === 'صبحانه' ? '🍳' : state.foodOrder.mealType === 'شام' ? '🌙' : '🍲';
        mealsSummaryHtml += `
          <div class="unified-food-item" style="color: var(--brand-teal-dark); font-weight: 700;">
            <span>${icon} وعده جاری (${state.foodOrder.mealType || 'ناهار'}): ${currentDishesNames}</span>
            <span>در حال انتخاب</span>
          </div>
        `;
      }

      foodContent.innerHTML = `
        <div class="unified-food-dishes-list">
          ${mealsSummaryHtml}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 12.5px; color: var(--brand-teal-dark); font-weight: 700;">
          <span>مجموع وعده‌های ثبت‌شده: ${formatPersianNumber(totalMealCount)} وعده</span>
          <span>جمع غذا: ${formatToman(foodEstimate)}</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <button type="button" class="btn btn-outline" style="font-size: 12px; padding: 6px 12px; flex: 1;" onclick="navigateToFoodFromReservation()">
            ✏️ افزودن / ویرایش وعده‌ها
          </button>
          <button type="button" class="btn btn-outline" style="font-size: 12px; padding: 6px 12px; color: #b23b3b; border-color: #f1cfcf;" onclick="clearFoodFromReservation()">
            🗑️ حذف تمام وعده‌ها
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
    if (selectedRooms.length === 0) {
      summaryRoomEl.textContent = "اتاقی انتخاب نشده است";
    } else if (selectedRooms.length === 1) {
      summaryRoomEl.textContent = `اتاق ${selectedRooms[0].name} (${formatPersianNumber(state.reservation.guests)} نفر، ${formatPersianNumber(state.reservation.nights)} شب با صبحانه)`;
    } else {
      const names = selectedRooms.map(r => r.name).join(" + ");
      summaryRoomEl.textContent = `${formatPersianNumber(selectedRooms.length)} اتاق (${names}) - ${formatPersianNumber(state.reservation.guests)} نفر، ${formatPersianNumber(state.reservation.nights)} شب با صبحانه`;
    }
  }
  if (summaryRoomPriceEl) {
    summaryRoomPriceEl.textContent = formatToman(roomEstimate);
  }

  if (summaryFoodRowEl && summaryFoodPriceEl) {
    if (totalMealCount > 0) {
      summaryFoodRowEl.style.display = "flex";
      if (summaryFoodTitleEl) {
        summaryFoodTitleEl.textContent = `سفارش خوراک سنتی (${formatPersianNumber(totalMealCount)} وعده):`;
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
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);
  const totalCap = selectedRooms.reduce((sum, r) => sum + r.capacity, 0) || 2;
  const maxAllowed = totalCap + (selectedRooms.length || 1) * 2;

  let g = state.reservation.guests + delta;
  if (g < (selectedRooms.length || 1)) g = (selectedRooms.length || 1);
  if (g > maxAllowed) g = maxAllowed;
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
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length > 1) {
    const isValid = checkGroupRuleViolation(() => {
      executeSaveFoodAndReturnToReservation();
    });
    if (isValid) {
      executeSaveFoodAndReturnToReservation();
    }
    return;
  }
  executeSaveFoodAndReturnToReservation();
}

function executeSaveFoodAndReturnToReservation() {
  syncFoodToReservationInputs();
  updateReservationCalculations();
  navigateTo("screen-reservation");
  showToast("غذاهای انتخابی با موفقیت به سفارش اقامت اضافه شدند.");
}

// حذف سفارش غذا از اقامت
function clearFoodFromReservation() {
  triggerHaptic('light');
  state.foodOrder.selectedDishes = {};
  state.foodOrder.scheduledMeals = [];
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
 * تولید متن پیام یکپارچه نهایی (شامل اطلاعات اقامت + وعده‌های غذایی چند روزه یا سفارش مستقل غذا)
 */
function generateUnifiedOrderMessage() {
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  const name = state.reservation.name || state.foodOrder.name || "مهمان گرامی";
  const phone = state.reservation.phone || state.foodOrder.phone || "";
  const checkIn = state.reservation.checkInDate;
  const checkOut = state.reservation.checkOutDate || addDaysToDateString(checkIn, state.reservation.nights);
  const nights = state.reservation.nights;
  const guests = state.reservation.guests;

  let roomTotal = 0;
  let roomsDetailText = "";

  if (selectedRooms.length === 1) {
    roomTotal = nights * guests * selectedRooms[0].price;
    roomsDetailText = `• اتاق: ${selectedRooms[0].name} (${formatToman(selectedRooms[0].price)} هر نفر/شب با صبحانه)`;
  } else if (selectedRooms.length > 1) {
    const sumPrices = selectedRooms.reduce((sum, r) => sum + r.price, 0);
    const avgPrice = Math.round(sumPrices / selectedRooms.length);
    roomTotal = nights * guests * avgPrice;
    roomsDetailText = `• اتاق‌های انتخابی (${formatPersianNumber(selectedRooms.length)} اتاق):
${selectedRooms.map(r => `  ▫️ اتاق ${r.name} (${formatToman(r.price)} هر نفر/شب با صبحانه)`).join("\n")}`;
  }

  // تجمیع کلیه وعده‌های غذایی (برنامه چند روزه + اقلام در حال انتخاب)
  const scheduled = [...(state.foodOrder.scheduledMeals || [])];
  const currentSelectedFoodIds = Object.keys(state.foodOrder.selectedDishes);

  if (currentSelectedFoodIds.length > 0) {
    let currentMealSubtotal = 0;
    const dishes = currentSelectedFoodIds.map(id => {
      const dish = FOOD_MENU.find(d => d.id === id);
      const qty = state.foodOrder.selectedDishes[id];
      const lineCost = dish ? dish.price * qty : 0;
      currentMealSubtotal += lineCost;
      return {
        id,
        name: dish ? dish.name : id,
        price: dish ? dish.price : 0,
        quantity: qty,
        total: lineCost
      };
    });

    scheduled.push({
      id: "current_active_meal",
      date: state.foodOrder.date || checkIn || getTodayFormattedDate(),
      dayOfWeek: state.foodOrder.dayOfWeek || "جمعه",
      mealType: state.foodOrder.mealType || "ناهار",
      dishes: dishes,
      subtotal: currentMealSubtotal
    });
  }

  let foodTotal = 0;
  let foodSectionText = "";

  if (scheduled.length > 0) {
    const mealsTextBlocks = scheduled.map((m, idx) => {
      foodTotal += m.subtotal;
      const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
      const dishesLines = m.dishes.map(d => `    ▫️ ${d.name} × ${formatPersianNumber(d.quantity)} پرس (${formatToman(d.total)})`).join("\n");
      return `  ${icon} وعده ${formatPersianNumber(idx + 1)}: ${m.mealType} (${m.dayOfWeek} ${formatPersianNumber(m.date)})
${dishesLines}
    جمع وعده: ${formatToman(m.subtotal)}`;
    }).join("\n\n");

    foodSectionText = `🍽️ برنامه وعده‌های غذایی انتخابی (${formatPersianNumber(scheduled.length)} وعده):
${mealsTextBlocks}
• برآورد کل خوراک و پذیرایی: ${formatToman(foodTotal)}`;
  } else {
    foodSectionText = `🍽️ سفارش خوراک:
• بدون سفارش غذای مازاد (اقامت همراه با صبحانه سنتی روستایی)`;
  }

  const grandTotal = roomTotal + foodTotal;

  // ۱. در صورتی که کاربر اتاق انتخاب کرده باشد (سفارش یکپارچه اقامت + غذا)
  if (selectedRooms.length > 0) {
    return `🌿 درخواست رزرو در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}

🏡 اقامت:
${roomsDetailText}
• ورود: ${formatPersianNumber(checkIn)}
• مدت: ${formatPersianNumber(nights)} شب (خروج: ${formatPersianNumber(checkOut)})
• تعداد نفرات کل: ${formatPersianNumber(guests)} نفر (با صبحانه سنتی روستایی)
• برآورد اقامت: ${formatToman(roomTotal)}

${foodSectionText}

💰 جمع کل برآورد: ${formatToman(grandTotal)}

🌱 این درخواست پس از بررسی میزبان تایید و نهایی می‌شود.
💬 اکانت تلگرام خانه برزک: @barzokhouse (https://t.me/barzokhouse)
🔗 گروه رزرو خانه برزک: ${CONFIG.reservationGroupUrl}
#درخواست_رزرو`;
  }

  // ۲. در صورتی که سفارش صرفاً برای غذا و صبحانه باشد (مستقل از اقامت)
  return `🍽️ درخواست سفارش غذای محلی و پذیرایی در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}

${foodSectionText}

💰 برآورد کل سفارش: ${formatToman(foodTotal)}

✨ تذکر: امکان پذیرایی در حیاط مصفای خانه برزک برای مهمانان آزاد فراهم می‌باشد (هزینه خدمات نفری ۲۰۰,۰۰۰ تومان).
🌱 سفارش شما پس از بررسی میزبان تایید و آماده‌سازی خواهد شد.
💬 اکانت تلگرام خانه برزک: @barzokhouse (https://t.me/barzokhouse)
🔗 گروه خانه برزک: ${CONFIG.reservationGroupUrl}
#سفارش_غذا`;
}

// ۱۰. ثبت و ارسال درخواست یکپارچه از فرم اقامت
function submitReservationForm(e) {
  if (e) e.preventDefault();
  triggerHaptic('medium');
  syncReservationToFoodInputs();

  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);
  if (selectedRooms.length === 0) {
    showToast("لطفاً ابتدا حداقل یک اتاق را به لیست رزرو اضافه کنید.");
    navigateTo("screen-rooms");
    return;
  }

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
    title: "پیش‌نمایش درخواست شما",
    subtitle: "خلاصه درخواست شما آماده ارسال به میزبان است:",
    messageText: messageText,
    actionType: "unified"
  });
}

// ۱۱. رندر کردن و مدیریت منوی غذاهای محلی خانه برزک
function getTagBadgeHtml(tag) {
  if (tag === "همراه با برنج") {
    return `<span class="badge-tag badge-tag-rice">🍚 همراه با برنج</span>`;
  } else if (tag === "نانی") {
    return `<span class="badge-tag badge-tag-bread">🫓 نانی</span>`;
  } else if (tag === "آش و سوپ") {
    return `<span class="badge-tag badge-tag-soup">🥣 آش و سوپ</span>`;
  } else if (tag === "صبحانه سنتی") {
    return `<span class="badge-tag badge-tag-breakfast">🍳 صبحانه سنتی</span>`;
  } else if (tag === "گوشتی") {
    return `<span class="badge-tag badge-tag-meat">🥩 گوشتی</span>`;
  } else if (tag === "گیاهی") {
    return `<span class="badge-tag badge-tag-veg">🌱 گیاهی</span>`;
  }
  return `<span class="badge-tag badge-tag-bread">${tag}</span>`;
}

function setFoodCategoryFilter(cat) {
  triggerHaptic('light');
  state.foodCategoryFilter = cat;
  
  // به‌روزرسانی استایل دکمه‌های دسته‌بندی
  const tabs = document.querySelectorAll("#food-category-tabs .food-tab-btn");
  tabs.forEach(btn => {
    const text = btn.textContent;
    let isTarget = false;
    if (cat === 'all' && text.includes('همه')) {
      isTarget = true;
    } else if (cat === 'خوراک‌های گوشتی با برنج' && text.includes('گوشتی با برنج')) {
      isTarget = true;
    } else if (cat === 'خوراک‌های گوشتی با نان' && text.includes('گوشتی با نان')) {
      isTarget = true;
    } else if (cat === 'خوراک‌های گیاهی با برنج' && text.includes('گیاهی با برنج')) {
      isTarget = true;
    } else if (cat === 'خوراک‌های گیاهی با نان' && text.includes('گیاهی با نان')) {
      isTarget = true;
    } else if (cat === 'آش و سوپ' && text.includes('آش و سوپ')) {
      isTarget = true;
    } else if ((cat === 'صبحانه' || cat === 'صبحانه سنتی') && text.includes('صبحانه')) {
      isTarget = true;
    }
    if (isTarget) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderFoodList();
}

function handleFoodSearch(query) {
  state.foodSearchQuery = (query || "").trim().toLowerCase();
  renderFoodList();
}

function toggleDishDetails(dishId, event) {
  if (event) {
    // جلوگیری از تداخل کلیک روی چک‌باکس یا استپر
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('.stepper')) {
      return;
    }
  }
  triggerHaptic('light');
  state.expandedFoodIds[dishId] = !state.expandedFoodIds[dishId];
  renderFoodList();
}

function toggleAllFoodDetails() {
  triggerHaptic('light');
  state.allFoodExpanded = !state.allFoodExpanded;
  
  FOOD_MENU.forEach(dish => {
    state.expandedFoodIds[dish.id] = state.allFoodExpanded;
  });

  const toggleAllBtn = document.getElementById("btn-toggle-all-food");
  if (toggleAllBtn) {
    toggleAllBtn.textContent = state.allFoodExpanded ? "بستن همه ▴" : "باز کردن همه ▾";
  }

  renderFoodList();
}

function renderFoodList() {
  const container = document.getElementById("dishes-list-container");
  if (!container) return;

  // فیلتر بر اساس دسته‌بندی
  let filteredDishes = FOOD_MENU;
  if (state.foodCategoryFilter && state.foodCategoryFilter !== "all") {
    if (state.foodCategoryFilter === "خوراک‌های گیاهی") {
      filteredDishes = filteredDishes.filter(d => d.category.includes("گیاهی"));
    } else if (state.foodCategoryFilter === "صبحانه" || state.foodCategoryFilter === "صبحانه سنتی") {
      filteredDishes = filteredDishes.filter(d => d.category === "صبحانه" || d.category === "صبحانه سنتی");
    } else {
      filteredDishes = filteredDishes.filter(d => d.category === state.foodCategoryFilter);
    }
  }

  // فیلتر بر اساس جستجو
  if (state.foodSearchQuery) {
    const q = state.foodSearchQuery;
    filteredDishes = filteredDishes.filter(d => {
      const nameMatch = d.name.toLowerCase().includes(q);
      const descMatch = (d.description || "").toLowerCase().includes(q);
      const ingMatch = (d.ingredients || []).some(ing => ing.toLowerCase().includes(q));
      const tagMatch = (d.tags || []).some(t => t.toLowerCase().includes(q));
      return nameMatch || descMatch || ingMatch || tagMatch;
    });
  }

  if (filteredDishes.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px 15px; background: var(--brand-surface); border: 1px dashed var(--brand-border); border-radius: var(--radius-md); color: var(--brand-text-muted);">
        <span style="font-size: 26px; display: block; margin-bottom: 6px;">🔍</span>
        <strong>خوراکی با این مشخصات یافت نشد.</strong>
        <p style="font-size: 12px; margin-top: 4px;">لطفاً عبارت دیگری را جستجو کنید یا فیلتر دسته‌بندی را تغییر دهید.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredDishes.map(dish => {
    const isSelected = !!state.foodOrder.selectedDishes[dish.id];
    const qty = state.foodOrder.selectedDishes[dish.id] || 1;
    const isExpanded = !!state.expandedFoodIds[dish.id];

    return `
      <div class="food-accordion-item ${isSelected ? 'selected' : ''}" id="dish-card-${dish.id}">
        <!-- سرستون کلیک‌خور برای باز و بسته شدن مشخصات -->
        <div class="food-item-header" onclick="toggleDishDetails('${dish.id}', event)">
          <div class="food-item-title-row">
            <span class="food-item-name">${dish.name}</span>
            <span class="food-item-price">${dish.priceDisplay || formatToman(dish.price)}</span>
          </div>
          <div class="food-item-meta-row">
            <div class="food-item-tags">
              ${(dish.tags || []).map(t => getTagBadgeHtml(t)).join("")}
            </div>
            <button type="button" class="food-item-toggle-btn" tabindex="-1">
              <span>${isExpanded ? 'بستن توضیحات ▴' : 'مشاهده توضیحات و مواد ▾'}</span>
            </button>
          </div>
        </div>

        <!-- بخش بازشونده توضیحات، مواد و عکس -->
        ${isExpanded ? `
          <div class="food-item-details">
            <div class="food-item-desc">${dish.description || ''}</div>
            ${dish.ingredients && dish.ingredients.length > 0 ? `
              <div class="food-item-ingredients-box">
                <span class="food-item-ingredients-title">🌿 مواد تشکیل‌دهنده:</span>
                <div class="food-item-ingredients-chips">
                  ${dish.ingredients.map(ing => `<span class="ingredient-chip">${ing}</span>`).join("")}
                </div>
              </div>
            ` : ''}
            ${dish.image ? `
              <img src="${dish.image}" alt="${dish.name}" class="food-item-image" loading="lazy" onerror="this.style.display='none';" />
            ` : ''}
          </div>
        ` : ''}

        <!-- ردیف انتخاب و تعداد پرس -->
        <div class="food-item-action-row">
          <label class="dish-checkbox-wrap" onclick="event.stopPropagation();">
            <input type="checkbox" id="check-${dish.id}" ${isSelected ? 'checked' : ''} onchange="toggleDishSelection('${dish.id}')" />
            <span style="font-weight: 700; font-size: 12.5px;">${isSelected ? '✓ انتخاب شده' : 'انتخاب این خوراک'}</span>
          </label>
          ${isSelected ? `
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 11.5px; color: var(--brand-text-muted);">تعداد:</span>
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
}

function renderFoodSection() {
  const banner = document.getElementById("food-linked-stay-banner");
  const bannerText = document.getElementById("food-linked-stay-text");
  const saveReturnBtn = document.getElementById("btn-save-food-return");
  const room = ROOMS.find(r => r.id === state.selectedRoomId) || ROOMS[0];

  if (state.foodReturnToReservation) {
    if (banner && bannerText) {
      banner.style.display = "flex";
      bannerText.textContent = `🏡 در حال انتخاب غذای محلی همراه با اقامت در اتاق «${room.name}» (ورود: ${formatPersianNumber(state.reservation.checkInDate)})`;
    }
    if (saveReturnBtn) {
      saveReturnBtn.style.display = "block";
    }
  } else {
    if (banner) {
      banner.style.display = "none";
    }
    if (saveReturnBtn) {
      saveReturnBtn.style.display = "none";
    }
  }

  // هماهنگی وضعیت چک‌باکس سفر گروهی
  const groupCheckbox = document.getElementById("food-group-travel-checkbox");
  if (groupCheckbox) {
    groupCheckbox.checked = !!state.foodOrder.isGroupTravel;
  }

  // پر کردن خودکار فیلدهای نام، تلفن، تاریخ و نوع وعده در فرم غذا
  const foodNameInput = document.getElementById("food-name");
  const foodPhoneInput = document.getElementById("food-phone");
  const foodDateInput = document.getElementById("food-date");
  const foodDaySelect = document.getElementById("food-day");
  const foodMealSelect = document.getElementById("food-meal");
  const currentMealBadge = document.getElementById("current-meal-badge");

  if (foodNameInput && !foodNameInput.value && state.reservation.name) {
    foodNameInput.value = state.reservation.name;
    state.foodOrder.name = state.reservation.name;
  }
  if (foodPhoneInput && !foodPhoneInput.value && state.reservation.phone) {
    foodPhoneInput.value = state.reservation.phone;
    state.foodOrder.phone = state.reservation.phone;
  }
  if (foodDateInput) {
    if (!foodDateInput.value && state.reservation.checkInDate) {
      foodDateInput.value = state.reservation.checkInDate;
      state.foodOrder.date = state.reservation.checkInDate;
    } else if (state.foodOrder.date) {
      foodDateInput.value = state.foodOrder.date;
    }
  }
  if (foodDaySelect && state.foodOrder.dayOfWeek) {
    foodDaySelect.value = state.foodOrder.dayOfWeek;
  }
  if (foodMealSelect && state.foodOrder.mealType) {
    foodMealSelect.value = state.foodOrder.mealType;
  }
  if (currentMealBadge) {
    const mealIcon = state.foodOrder.mealType === 'صبحانه' ? '🍳' : state.foodOrder.mealType === 'شام' ? '🌙' : '🍲';
    currentMealBadge.textContent = `${mealIcon} در حال انتخاب: ${state.foodOrder.mealType || 'ناهار'}`;
  }

  renderFoodList();
  renderScheduledMeals();
  updateFoodOrderSummary();
}

// مدیریت تغییر نوع وعده جاری
function handleFoodMealTypeChange(meal) {
  triggerHaptic('light');
  state.foodOrder.mealType = meal;
  const currentMealBadge = document.getElementById("current-meal-badge");
  if (currentMealBadge) {
    const mealIcon = meal === 'صبحانه' ? '🍳' : meal === 'شام' ? '🌙' : '🍲';
    currentMealBadge.textContent = `${mealIcon} در حال انتخاب: ${meal}`;
  }
  if (meal === 'صبحانه') {
    setFoodCategoryFilter('صبحانه سنتی');
  }
  updateFoodOrderSummary();
}

// مدیریت تغییر تاریخ وعده جاری
function handleFoodDateChange(dateVal) {
  state.foodOrder.date = dateVal;
  try {
    const dateObj = new Date(dateVal);
    if (!isNaN(dateObj.getTime())) {
      const dayIndex = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
      const daysMap = { 6: "شنبه", 0: "یکشنبه", 1: "دوشنبه", 2: "سه‌شنبه", 3: "چهارشنبه", 4: "پنج‌شنبه", 5: "جمعه" };
      const computedDay = daysMap[dayIndex] || "جمعه";
      state.foodOrder.dayOfWeek = computedDay;
      const foodDaySelect = document.getElementById("food-day");
      if (foodDaySelect) foodDaySelect.value = computedDay;
    }
  } catch (e) {}
  updateFoodOrderSummary();
}

// افزودن سریع صبحانه سنتی روستایی به سفارش
function quickAddBreakfastMeal() {
  triggerHaptic('medium');
  state.foodOrder.mealType = "صبحانه";
  const foodMealSelect = document.getElementById("food-meal");
  if (foodMealSelect) foodMealSelect.value = "صبحانه";

  // فعال‌سازی تب صبحانه
  setFoodCategoryFilter("صبحانه سنتی");

  // باز کردن توضیحات صبحانه سنتی
  state.expandedFoodIds["breakfast-barzok"] = true;

  // اضافه کردن حداقل یک پرس صبحانه اگر هنوز انتخاب نشده است
  if (!state.foodOrder.selectedDishes["breakfast-barzok"]) {
    state.foodOrder.selectedDishes["breakfast-barzok"] = Math.max(1, state.reservation.guests || 2);
  }

  renderFoodSection();
  updateReservationCalculations();

  // اسکرول نرم به فرم غذا
  const formEl = document.getElementById("food-order-form");
  if (formEl) {
    formEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  showToast("صبحانه سنتی روستایی به سفارش شما اضافه شد. می‌توانید تعداد پرس یا روز را تنظیم کنید.");
}

// متغیر نگه‌دارنده عملیات معلق جهت اجرا پس از حل مغایرت گروهی
let pendingGroupAction = null;

/**
 * بررسی قانون انتخاب ۲ نوع غذا:
 * برای انتخاب ۲ نوع غذا در یک وعده، باید حتماً گروه بالای ۱۰ نفر باشد،
 * یعنی اقامت بالای ۱۰ نفر درخواست شده باشد یا برای بالای ۱۰ نفر غذا درخواستش ثبت شود.
 * اگر زیر ۱۰ نفر باشد، پنجره انتخاب هوشمند باز می‌شود.
 */
function checkGroupRuleViolation(callbackIfValid) {
  const selectedDishIds = Object.keys(state.foodOrder.selectedDishes);
  
  // اگر ۱ نوع غذا یا کمتر انتخاب شده، هیچ محدودیتی در تعداد نفرات وجود ندارد
  if (selectedDishIds.length <= 1) {
    if (typeof callbackIfValid === "function") callbackIfValid();
    return true;
  }

  // در صورت انتخاب ۲ نوع غذا، تعداد نفرات اقامت و تعداد پرس‌های این وعده بررسی می‌شود
  const guestsCount = (state.reservation && Number(state.reservation.guests)) || 0;
  const portionsCount = selectedDishIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);

  // شرط قانون: اقامت بالای ۱۰ نفر (> 10) یا مجموع پرس‌های غذا در این وعده بالای ۱۰ (> 10)
  const isAboveTen = (guestsCount > 10) || (portionsCount > 10);

  if (isAboveTen) {
    if (typeof callbackIfValid === "function") callbackIfValid();
    return true;
  }

  // در صورتی که تعداد زیر ۱۰ نفر باشد (۱۰ یا کمتر):
  triggerHaptic('warning');
  openGroupRuleModal({
    selectedDishIds,
    guestsCount,
    portionsCount,
    onSuccess: callbackIfValid
  });
  return false;
}

function openGroupRuleModal({ selectedDishIds, guestsCount, portionsCount, onSuccess }) {
  pendingGroupAction = onSuccess;
  
  const modal = document.getElementById("group-rule-modal");
  const statusBox = document.getElementById("group-rule-status-box");
  const actionButtons = document.getElementById("group-rule-action-buttons");
  if (!modal || !statusBox || !actionButtons) return;

  const dishId1 = selectedDishIds[0];
  const dishId2 = selectedDishIds[1];
  const dish1 = FOOD_MENU.find(d => d.id === dishId1) || { name: "غذای اول" };
  const dish2 = FOOD_MENU.find(d => d.id === dishId2) || { name: "غذای دوم" };
  const qty1 = Number(state.foodOrder.selectedDishes[dishId1]) || 1;
  const qty2 = Number(state.foodOrder.selectedDishes[dishId2]) || 1;
  const totalQty = qty1 + qty2;

  statusBox.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 6px; color: #c2410c;">
      📊 وضعیت فعلی سفارش شما (${formatPersianNumber(Math.max(guestsCount, totalQty))} نفر / زیر ۱۰ نفر):
    </div>
    <div style="line-height: 1.8;">
      • نفرات اقامت ثبت‌شده: <strong>${guestsCount > 0 ? formatPersianNumber(guestsCount) + ' نفر' : 'ثبت نشده'}</strong><br/>
      • مجموع پرس‌های این وعده: <strong>${formatPersianNumber(totalQty)} پرس</strong> (${dish1.name}: ${formatPersianNumber(qty1)} پرس + ${dish2.name}: ${formatPersianNumber(qty2)} پرس)
    </div>
    <div style="margin-top: 8px; font-size: 11.5px; color: #7c2d12; border-top: 1px dashed #fdba74; padding-top: 6px;">
      💡 طبق ضوابط بومگردی، طبخ ۲ نوع غذا در یک وعده تنها مختص گروه‌های <strong>بالای ۱۰ نفر</strong> است.
    </div>
  `;

  actionButtons.innerHTML = `
    <button type="button" class="btn btn-primary" onclick="resolveGroupConflictKeepSingle('${dishId1}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
      <span>🍛 انتخاب ۱ نوع غذا: فقط «${dish1.name}»</span>
      <span style="opacity: 0.9;">(${formatPersianNumber(qty1)} پرس) ←</span>
    </button>

    <button type="button" class="btn btn-primary" onclick="resolveGroupConflictKeepSingle('${dishId2}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
      <span>🥘 انتخاب ۱ نوع غذا: فقط «${dish2.name}»</span>
      <span style="opacity: 0.9;">(${formatPersianNumber(qty2)} پرس) ←</span>
    </button>

    <button type="button" class="btn btn-mustard" onclick="resolveGroupConflictIncreaseToAboveTen()" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
      <span>👥 افزایش تعداد به بالای ۱۰ نفر (سفارش گروهی)</span>
      <span>۱۱ پرس ←</span>
    </button>

    <button type="button" class="btn btn-outline" onclick="closeGroupRuleModal()" style="font-size: 12.5px; padding: 8px 12px; color: var(--brand-text-muted);">
      ✏️ انصراف و تنظیم دستی در منو
    </button>
  `;

  modal.classList.add("active");
}

function closeGroupRuleModal() {
  triggerHaptic('light');
  const modal = document.getElementById("group-rule-modal");
  if (modal) modal.classList.remove("active");
  pendingGroupAction = null;
}

function resolveGroupConflictKeepSingle(dishIdToKeep) {
  triggerHaptic('medium');
  const currentKeys = Object.keys(state.foodOrder.selectedDishes);
  const dishToRemove = currentKeys.find(id => id !== dishIdToKeep);
  if (dishToRemove) {
    delete state.foodOrder.selectedDishes[dishToRemove];
  }
  
  const keptDish = FOOD_MENU.find(d => d.id === dishIdToKeep);
  const dishName = keptDish ? keptDish.name : "غذای انتخابی";
  
  closeGroupRuleModal();
  renderFoodSection();
  updateReservationCalculations();
  showToast(`تنها «${dishName}» در این وعده ثبت شد.`);

  if (typeof pendingGroupAction === "function") {
    const action = pendingGroupAction;
    pendingGroupAction = null;
    action();
  }
}

function resolveGroupConflictIncreaseToAboveTen() {
  triggerHaptic('medium');
  const currentKeys = Object.keys(state.foodOrder.selectedDishes);
  if (currentKeys.length >= 2) {
    const q1 = Number(state.foodOrder.selectedDishes[currentKeys[0]]) || 1;
    const q2 = Number(state.foodOrder.selectedDishes[currentKeys[1]]) || 1;
    const currentSum = q1 + q2;
    if (currentSum <= 10) {
      const needed = 11 - currentSum;
      const add1 = Math.ceil(needed / 2);
      const add2 = needed - add1;
      state.foodOrder.selectedDishes[currentKeys[0]] = q1 + add1;
      state.foodOrder.selectedDishes[currentKeys[1]] = q2 + add2;
    }
  } else if (currentKeys.length === 1) {
    state.foodOrder.selectedDishes[currentKeys[0]] = Math.max(11, Number(state.foodOrder.selectedDishes[currentKeys[0]]) || 11);
  }

  closeGroupRuleModal();
  renderFoodSection();
  updateReservationCalculations();
  showToast("تعداد پرس‌های غذا به بالای ۱۰ نفر (۱۱ پرس) افزایش یافت و ثبت شد.");

  if (typeof pendingGroupAction === "function") {
    const action = pendingGroupAction;
    pendingGroupAction = null;
    action();
  }
}

// افزودن وعده جاری به لیست برنامه چند روزه/چند وعده‌ای
function addCurrentMealToSchedule() {
  triggerHaptic('medium');
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length === 0) {
    showToast("لطفاً ابتدا حداقل یک غذا از منوی بالا برای این وعده انتخاب کنید.");
    return;
  }

  // اعتبارسنجی قانون انتخاب ۲ نوع غذا: اگر زیر ۱۰ نفر باشد باید اصلاح شود
  const isValid = checkGroupRuleViolation(() => {
    executeAddCurrentMealToSchedule();
  });
  if (isValid) {
    executeAddCurrentMealToSchedule();
  }
}

function executeAddCurrentMealToSchedule() {
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length === 0) return;

  const dateInput = document.getElementById("food-date");
  const daySelect = document.getElementById("food-day");
  const mealSelect = document.getElementById("food-meal");

  const mealDate = (dateInput && dateInput.value) || state.foodOrder.date || getTodayFormattedDate();
  const mealDay = (daySelect && daySelect.value) || state.foodOrder.dayOfWeek || "جمعه";
  const mealType = (mealSelect && mealSelect.value) || state.foodOrder.mealType || "ناهار";

  let mealSubtotal = 0;
  const dishes = selectedIds.map(id => {
    const dish = FOOD_MENU.find(d => d.id === id);
    const qty = state.foodOrder.selectedDishes[id];
    const total = (dish ? dish.price : 0) * qty;
    mealSubtotal += total;
    return {
      id: id,
      name: dish ? dish.name : id,
      price: dish ? dish.price : 0,
      quantity: qty,
      total: total
    };
  });

  const scheduledItem = {
    id: "meal_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
    date: mealDate,
    dayOfWeek: mealDay,
    mealType: mealType,
    dishes: dishes,
    subtotal: mealSubtotal
  };

  if (!state.foodOrder.scheduledMeals) {
    state.foodOrder.scheduledMeals = [];
  }
  state.foodOrder.scheduledMeals.push(scheduledItem);

  // خالی کردن غذاهای وعده جاری جهت تنظیم وعده بعدی
  state.foodOrder.selectedDishes = {};

  // پیشنهاد هوشمند برای وعده بعدی
  if (mealType === "صبحانه") {
    state.foodOrder.mealType = "ناهار";
  } else if (mealType === "ناهار") {
    state.foodOrder.mealType = "شام";
  } else if (mealType === "شام") {
    state.foodOrder.mealType = "صبحانه";
    try {
      state.foodOrder.date = addDaysToDateString(mealDate, 1);
    } catch (e) {}
  }

  showToast(`وعده ${mealType} (${mealDay}) ثبت شد! اکنون می‌توانید وعده بعدی را انتخاب نمایید.`);
  renderFoodSection();
  updateReservationCalculations();
}

// حذف یک وعده از لیست وعده‌های ثبت‌شده
function removeScheduledMeal(mealId) {
  triggerHaptic('light');
  if (!state.foodOrder.scheduledMeals) return;
  state.foodOrder.scheduledMeals = state.foodOrder.scheduledMeals.filter(m => m.id !== mealId);
  showToast("وعده غذایی از برنامه حذف شد.");
  renderFoodSection();
  updateReservationCalculations();
}

// رندر کارت‌های برنامه وعده‌های غذایی ثبت‌شده
function renderScheduledMeals() {
  const container = document.getElementById("scheduled-meals-container");
  if (!container) return;

  const scheduled = state.foodOrder.scheduledMeals || [];
  if (scheduled.length === 0) {
    container.innerHTML = "";
    return;
  }

  let totalScheduledSum = 0;
  const itemsHtml = scheduled.map((m, index) => {
    totalScheduledSum += m.subtotal;
    const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
    const dishesList = m.dishes.map(d => `
      <div class="scheduled-meal-dish-line">
        <span>▫️ ${d.name} × ${formatPersianNumber(d.quantity)} پرس</span>
        <span>${formatToman(d.total)}</span>
      </div>
    `).join("");

    return `
      <div class="scheduled-meal-item">
        <div class="scheduled-meal-header">
          <span class="scheduled-meal-badge">
            ${icon} وعده ${formatPersianNumber(index + 1)}: ${m.mealType} (${m.dayOfWeek} ${formatPersianNumber(m.date)})
          </span>
          <button type="button" class="scheduled-meal-delete-btn" onclick="removeScheduledMeal('${m.id}')" title="حذف این وعده">
            🗑️ حذف
          </button>
        </div>
        ${dishesList}
        <div class="scheduled-meal-subtotal">
          <span>هزینه این وعده:</span>
          <span>${formatToman(m.subtotal)}</span>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="scheduled-meals-box">
      <div class="scheduled-meals-title">
        <span>📅 برنامه وعده‌های غذایی ثبت‌شده (${formatPersianNumber(scheduled.length)} وعده):</span>
        <span>${formatToman(totalScheduledSum)}</span>
      </div>
      ${itemsHtml}
    </div>
  `;
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
        showToast("در هر وعده می‌توانید یک نوع غذا انتخاب کنید. برای انتخاب تا ۲ غذا، گزینه سفر گروهی را فعال کنید.");
      } else {
        showToast("در سفر گروهی می‌توانید حداکثر دو نوع غذا انتخاب کنید.");
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
    showToast("تعداد غذاها به یک نوع تنظیم شد.");
  }
  renderFoodSection();
  updateReservationCalculations();
}

function changeDishQty(dishId, delta) {
  triggerHaptic('light');
  if (!state.foodOrder.selectedDishes[dishId]) return;
  let q = state.foodOrder.selectedDishes[dishId] + delta;
  if (q < 1) q = 1;
  if (q > 50) q = 50;
  state.foodOrder.selectedDishes[dishId] = q;
  renderFoodSection();
  updateReservationCalculations();
}

function updateFoodOrderSummary() {
  const summaryBox = document.getElementById("food-order-summary");
  if (!summaryBox) return;

  const scheduled = state.foodOrder.scheduledMeals || [];
  const currentSelectedIds = Object.keys(state.foodOrder.selectedDishes);

  if (scheduled.length === 0 && currentSelectedIds.length === 0) {
    summaryBox.innerHTML = `
      <div style="font-size: 12.5px; color: var(--brand-text-muted); text-align: center;">
        هنوز غذایی انتخاب نشده است. از منوی بالا غذاهای محلی یا صبحانه را انتخاب کنید و برای ثبت چند روز یا چند وعده، دکمه «ثبت این وعده» را بزنید.
      </div>
    `;
    return;
  }

  let grandTotal = 0;
  let summaryRows = "";

  // ۱. وعده‌های ثبت‌شده قبلی
  if (scheduled.length > 0) {
    scheduled.forEach((m, idx) => {
      grandTotal += m.subtotal;
      const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
      summaryRows += `
        <div class="estimate-row">
          <span>${icon} وعده ${formatPersianNumber(idx + 1)} (${m.mealType} ${m.dayOfWeek}):</span>
          <span>${formatToman(m.subtotal)}</span>
        </div>
      `;
    });
  }

  // ۲. اقلام انتخابی در وعده جاری (هنوز دکمه ثبت زده نشده است)
  if (currentSelectedIds.length > 0) {
    let currentMealTotal = 0;
    currentSelectedIds.forEach((id) => {
      const dish = FOOD_MENU.find(d => d.id === id);
      const qty = state.foodOrder.selectedDishes[id];
      const lineTotal = dish ? dish.price * qty : 0;
      currentMealTotal += lineTotal;
    });
    grandTotal += currentMealTotal;

    const icon = state.foodOrder.mealType === 'صبحانه' ? '🍳' : state.foodOrder.mealType === 'شام' ? '🌙' : '🍲';
    summaryRows += `
      <div class="estimate-row" style="color: var(--brand-teal-dark); font-weight: 700;">
        <span>${icon} وعده جاری (${state.foodOrder.mealType || 'ناهار'} - در حال انتخاب):</span>
        <span>${formatToman(currentMealTotal)}</span>
      </div>
    `;
  }

  summaryBox.innerHTML = `
    ${summaryRows}
    <div class="estimate-row estimate-total">
      <span>جمع کل برآورد سفارش غذا:</span>
      <span>${formatToman(grandTotal)}</span>
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
  const scheduled = state.foodOrder.scheduledMeals || [];
  const currentSelectedIds = Object.keys(state.foodOrder.selectedDishes);

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
  if (scheduled.length === 0 && currentSelectedIds.length === 0) {
    showToast("لطفاً حداقل یک غذا از منو یا برنامه وعده‌ها انتخاب کنید.");
    return;
  }

  // اعتبارسنجی قانون گروهی (در صورت انتخاب ۲ نوع غذا در وعده جاری)
  if (currentSelectedIds.length > 1) {
    const isValid = checkGroupRuleViolation(() => {
      executeSubmitFoodOrderForm();
    });
    if (isValid) {
      executeSubmitFoodOrderForm();
    }
    return;
  }

  executeSubmitFoodOrderForm();
}

function executeSubmitFoodOrderForm() {
  updateReservationCalculations();
  const messageText = generateUnifiedOrderMessage();

  openMessagePreviewModal({
    title: "پیش‌نمایش درخواست شما",
    subtitle: "خلاصه درخواست شما آماده ارسال به گروه رزرو خانه برزک است:",
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
 * ۱. ارسال مستقیم به اکانت تلگرام خانه برزک (@barzokhouse)
 * متن پیام به کلیپ‌بورد کپی شده و گفتگوی مستقیم تلگرام با اکانت @barzokhouse باز می‌شود.
 */
function sendToBarzokTelegramAccount() {
  triggerHaptic('medium');
  copyModalMessage();
  const accountUrl = CONFIG.telegramAccountUrl || "https://t.me/barzokhouse";

  showToast("متن درخواست کپی شد! در حال باز کردن چت با اکانت تلگرام خانه برزک (@barzokhouse)...");
  
  setTimeout(() => {
    if (tg && tg.openTelegramLink) {
      try {
        tg.openTelegramLink(accountUrl);
        closeMessageModal();
        return;
      } catch (e) {
        console.warn("tg.openTelegramLink failed, using window.open", e);
      }
    }
    window.open(accountUrl, '_blank');
    closeMessageModal();
  }, 450);
}

/**
 * ۲. ارسال سریع در تلگرام با پیش‌نویس خودکار (Telegram Direct Share)
 * با این قابلیت پروتکل تلگرام، متن کامل درخواست از پیش در کادر پیام قرار گرفته
 * و کاربر تنها با انتخاب اکانت @barzokhouse یا گروه، دکمه ارسال را لمس می‌کند.
 */
function shareViaTelegram() {
  triggerHaptic('medium');
  copyModalMessage();
  const shareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(currentModalMessage)}`;
  
  showToast("در حال باز کردن تلگرام با متن آماده و پیش‌نویس رزرو...");
  
  setTimeout(() => {
    if (tg && tg.openTelegramLink) {
      try {
        tg.openTelegramLink(shareUrl);
        closeMessageModal();
        return;
      } catch (e) {
        console.warn("tg.openTelegramLink failed, using window.open", e);
      }
    }
    window.open(shareUrl, '_blank');
    closeMessageModal();
  }, 350);
}

/**
 * ۳. باز کردن مستقیم لینک اختصاصی گروه رزرو خانه برزک
 */
function sendDirectToReservationGroup() {
  triggerHaptic('medium');
  copyModalMessage();
  const groupWebUrl = CONFIG.reservationGroupUrl || "https://web.telegram.org/k/#-4485664573";
  const groupDeepLink = CONFIG.reservationGroupDeepLink || "https://t.me/c/4485664573";
  const groupInviteUrl = CONFIG.reservationGroupInviteUrl || "https://t.me/+wigY6VanuYplYTk8";

  showToast("متن درخواست کپی شد! در حال باز کردن گروه رزرو خانه برزک...");
  setTimeout(() => {
    if (tg && tg.openTelegramLink) {
      try {
        tg.openTelegramLink(groupDeepLink);
        closeMessageModal();
        return;
      } catch (e) {
        console.warn("tg.openTelegramLink failed, trying invite/web", e);
        try {
          tg.openTelegramLink(groupInviteUrl);
          closeMessageModal();
          return;
        } catch (e2) {}
      }
    }
    window.open(groupWebUrl, '_blank');
    closeMessageModal();
  }, 450);
}

/**
 * ۴. ارسال مستقیم متن رزرو از طریق پیامک (SMS) به شماره میزبان
 */
function sendViaSMS(e) {
  if (e) e.preventDefault();
  triggerHaptic('medium');
  copyModalMessage();
  const phone = CONFIG.phone1 || "09354868840";
  const smsUrl = `sms:${phone}?body=${encodeURIComponent(currentModalMessage)}`;
  showToast("متن کپی شد؛ در حال انتقال به پیامک گوشی...");
  setTimeout(() => {
    window.location.href = smsUrl;
  }, 300);
}

/**
 * ۵. ارسال خودکار و مستقیم به گروه رزرو خانه برزک از طریق بات و ورکر کلادفلر
 */
function sendViaTelegram() {
  triggerHaptic('medium');
  copyModalMessage();

  const isDirectWorkerHost = window.location.hostname.includes("workers.dev") || window.location.hostname.includes("pages.dev");
  const primaryUrl = isDirectWorkerHost ? "/api/reserve" : `${CONFIG.workerUrl}/api/reserve`;
  const fallbackUrl = isDirectWorkerHost ? "/" : `${CONFIG.workerUrl}/`;

  showToast("در حال ارسال درخواست به گروه رزرو خانه برزک...");

  const sendBtn = document.getElementById("btn-modal-send-tg");
  const originalBtnHtml = sendBtn ? sendBtn.innerHTML : "";
  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = "⏳ در حال ارسال به گروه رزرو...";
  }

  const reqBody = JSON.stringify({
    action: "submit_reservation",
    isMiniAppOrder: true,
    message: currentModalMessage,
    initData: (tg && tg.initData) ? tg.initData : "",
    data: {
      reservation: state.reservation,
      foodOrder: state.foodOrder
    }
  });

  const sendRequest = async (url) => {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: reqBody
    });
  };

  sendRequest(primaryUrl)
  .then(async (res) => {
    if (res.status === 404 || res.status === 405) {
      // تلاش مجدد با روت اصلی ورکر
      return sendRequest(fallbackUrl);
    }
    return res;
  })
  .then(async (res) => {
    let data = null;
    try {
      data = await res.json();
    } catch (e) {}

    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = originalBtnHtml || "🚀 ارسال خودکار به گروه رزرو خانه برزک";
    }

    if (res.ok && data && (data.ok === true || data.forwarded_to_group === true)) {
      triggerHaptic('success');
      showToast("✅ درخواست با موفقیت در گروه رزرو خانه برزک ثبت شد.");
      const previewEl = document.getElementById("modal-message-preview");
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="background: #e6f7f4; border: 1px solid #1f8578; color: #13524a; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
            <div style="font-size: 15px; font-weight: 800; margin-bottom: 6px;">درخواست با موفقیت در گروه رزرو خانه برزک ثبت گردید!</div>
            <div style="font-size: 12.5px; line-height: 1.6; color: #2d4d42;">
              پیام شما توسط بات در گروه رزرو خانه برزک قرار گرفت. میزبان اقامتگاه پیام شما را بررسی کرده و به زودی با شما هماهنگ خواهد شد.
            </div>
          </div>
        `;
      }
      setTimeout(() => closeMessageModal(), 3500);
    } else {
      triggerHaptic('warning');
      const errNote = (data && data.note) || (data && data.error) || (res.status === 405 ? "کد ۴۰۵ (ورکر در این دامنه فعال نشده است)" : `خطای سرور (${res.status})`);
      showToast(`توجه: ${errNote}`);
      
      const previewEl = document.getElementById("modal-message-preview");
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="background: #fff7ed; border: 1px solid #ffedd5; color: #9a3412; padding: 14px; border-radius: 8px; text-align: right; margin-bottom: 12px; font-size: 12.5px; line-height: 1.6;">
            <strong>⚠️ وضعیت ارسال به گروه تلگرام:</strong><br/>
            ${errNote}<br/>
            <span style="font-size: 11.5px; color: #7c2d12;">متن کامل درخواست در حافظه کپی شد؛ می‌توانید از دکمه زیر برای باز کردن مستقیم گروه تلگرام استفاده کنید.</span>
          </div>
          <div style="white-space: pre-wrap; font-family: monospace; font-size: 12px; max-height: 120px; overflow-y: auto;">${currentModalMessage}</div>
        `;
      }
    }
  })
  .catch(err => {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = originalBtnHtml || "🚀 ارسال خودکار به گروه رزرو خانه برزک";
    }
    console.warn("Worker submission network notice:", err);
    triggerHaptic('warning');
    showToast("متن کپی شد. در حال هدایت به گروه تلگرام خانه برزک...");
    sendDirectToReservationGroup();
  });
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
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  updateFloatingBookingBar();
});

// اکسپورت توابع به پنجره سراسری (Global Window) برای دسترسی آسان در رویدادهای HTML
window.navigateTo = navigateTo;
window.navigateBack = navigateBack;
window.openExternalUrl = openExternalUrl;
window.openRoomDetail = openRoomDetail;
window.updateRoomDetailButtons = updateRoomDetailButtons;
window.handleRoomDetailBookingClick = handleRoomDetailBookingClick;
window.startReservationForCurrentRoom = startReservationForCurrentRoom;
window.openReservationScreen = openReservationScreen;
window.removeRoomFromReservation = removeRoomFromReservation;
window.renderSelectedRoomsInForm = renderSelectedRoomsInForm;
window.updateFloatingBookingBar = updateFloatingBookingBar;
window.changeReservationNights = changeReservationNights;
window.changeReservationGuests = changeReservationGuests;
window.submitReservationForm = submitReservationForm;
window.setFoodCategoryFilter = setFoodCategoryFilter;
window.handleFoodSearch = handleFoodSearch;
window.toggleDishDetails = toggleDishDetails;
window.toggleAllFoodDetails = toggleAllFoodDetails;
window.toggleDishSelection = toggleDishSelection;
window.toggleGroupTravel = toggleGroupTravel;
window.changeDishQty = changeDishQty;
window.saveFoodAndReturnToReservation = saveFoodAndReturnToReservation;
window.submitFoodOrderForm = submitFoodOrderForm;
window.closeGroupRuleModal = closeGroupRuleModal;
window.resolveGroupConflictKeepSingle = resolveGroupConflictKeepSingle;
window.resolveGroupConflictIncreaseToAboveTen = resolveGroupConflictIncreaseToAboveTen;
window.closeMessageModal = closeMessageModal;
window.copyModalMessage = copyModalMessage;
window.sendToBarzokTelegramAccount = sendToBarzokTelegramAccount;
window.shareViaTelegram = shareViaTelegram;
window.sendDirectToReservationGroup = sendDirectToReservationGroup;
window.sendViaSMS = sendViaSMS;
window.sendViaTelegram = sendViaTelegram;
window.showToast = showToast;
window.CONFIG = CONFIG;
window.ROOMS = ROOMS;
window.FOOD_MENU = FOOD_MENU;
