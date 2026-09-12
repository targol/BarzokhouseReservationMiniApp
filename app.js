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
  // آدرس سرویس پشتیبان برای پردازش درخواست و ارسال مستقیم
  workerUrl: "https://barzokhousereservationminiapp.targol.workers.dev"
};

// ۲. اطلاعات اتاق‌ها (Rooms Data)
const ROOMS = [
  {
    id: "shatoot",
    name: "شاتوت",
    baseCapacity: 2,
    extraCapacityCount: 1,
    maxCapacity: 3,
    capacity: 3,
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
    baseCapacity: 3,
    extraCapacityCount: 1,
    maxCapacity: 4,
    capacity: 4,
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
    baseCapacity: 2,
    extraCapacityCount: 0,
    maxCapacity: 2,
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
    baseCapacity: 3,
    extraCapacityCount: 7,
    maxCapacity: 10,
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
    baseCapacity: 3,
    extraCapacityCount: 1,
    maxCapacity: 4,
    capacity: 4,
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
  selectedRoomId: null,
  reservationSourceScreen: "screen-rooms", // صفحه منبع ورود به رزرو (برای بازگشت دقیق)
  foodReturnToReservation: false, // آیا ورود به صفحه غذا از فرم رزرو اقامت بوده است؟
  floatingBarDismissed: false, // بستن موقت نوار شناور رزرو توسط کاربر
  foodCategoryFilter: "all", // فیلتر دسته‌بندی خوراک‌ها ('all' یا نام دسته‌بندی)
  foodSearchQuery: "", // متن جستجوی خوراک‌ها
  expandedFoodIds: {}, // لیست خوراک‌های بازشده در آکاردئون: { [dishId]: true }
  allFoodExpanded: false, // آیا تمام خوراک‌ها باز هستند؟
  reservation: {
    selectedRoomIds: [], // ابتدا خالی است تا بعد از ورود کاربر به اتاق یا غذا انتخاب شود
    roomGuests: {}, // تعداد نفرات برای هر اتاق: { [roomId]: guestsCount }
    roomCounts: {}, // حفظ سازگاری
    nights: 1,
    guests: 0, // مجموع کل نفرات اتاق‌ها
    checkInDate: "", // ابتدا خالی است تا کاربر از تقویم شمسی انتخاب کند
    checkOutDate: "",
    name: "",
    phone: "",
    notes: ""
  },
  foodOrder: {
    name: "",
    phone: "",
    notes: "",
    date: getTodayFormattedDate(),
    dayOfWeek: "جمعه",
    mealType: "ناهار",
    isGroupTravel: false,
    // در هر وعده حداکثر ۱ نوع غذا، و در سفر گروهی حداکثر ۲ نوع غذا: { [foodId]: quantity }
    selectedDishes: {},
    // برنامه وعده‌های چندگانه (برای چند روز یا چند وعده در روز یا صبحانه‌های مستقل):
    scheduledMeals: []
  },
  telegramUser: {
    id: null,
    username: "",
    firstName: "",
    lastName: "",
    phone: ""
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

      // دریافت نام، آیدی کاربری و شماره کاربر تلگرام
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const u = tg.initDataUnsafe.user;
        const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ");
        state.telegramUser = {
          id: u.id || null,
          username: u.username || "",
          firstName: u.first_name || "",
          lastName: u.last_name || "",
          phone: u.phone_number || ""
        };

        if (fullName) {
          state.reservation.name = fullName;
          state.foodOrder.name = fullName;
          const resNameEl = document.getElementById("res-name");
          const foodNameEl = document.getElementById("food-name");
          if (resNameEl && !resNameEl.value) resNameEl.value = fullName;
          if (foodNameEl && !foodNameEl.value) foodNameEl.value = fullName;
        }

        if (u.phone_number) {
          fillTelegramPhone(u.phone_number);
        }

        updateTelegramUserBadges();
      }
    } catch (e) {
      console.warn("Telegram WebApp initialization note:", e);
    }
  }
}

/**
 * درخواست بومی شماره تماس از تلگرام (Telegram WebApp Request Contact)
 */
function requestTelegramContact(targetField = 'res') {
  triggerHaptic('medium');
  if (tg && typeof tg.requestContact === 'function') {
    try {
      tg.requestContact((granted, response) => {
        if (granted) {
          let phone = "";
          if (response && response.responseUnsafe && response.responseUnsafe.contact) {
            phone = response.responseUnsafe.contact.phone_number;
          } else if (response && response.phone_number) {
            phone = response.phone_number;
          } else if (typeof response === 'string') {
            phone = response;
          }
          if (phone) {
            fillTelegramPhone(phone);
            showToast("شماره تلگرام شما با موفقیت دریافت و درج شد.");
            return;
          }
          showToast("شماره تماس تلگرام شما ثبت شد.");
        } else {
          showToast("دسترسی به شماره داده نشد. لطفاً شماره را به صورت دستی وارد فرمایید.");
        }
      });
      return;
    } catch (e) {
      console.warn("tg.requestContact error:", e);
    }
  }

  const savedPhone = state.telegramUser?.phone;
  if (savedPhone) {
    fillTelegramPhone(savedPhone);
    showToast("شماره تلگرام شما در فیلد قرار گرفت.");
    return;
  }

  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || state.telegramUser;
  if (tgUser && tgUser.username) {
    showToast(`حساب کاربری @${tgUser.username} شناسایی شد؛ لطفاً شماره تماس خود را در کادر بنویسید.`);
  } else {
    showToast("این قابلیت درون پیام‌رسان تلگرام شماره همراه حساب شما را دریافت می‌کند.");
  }
}

/**
 * استانداردسازی و درج شماره تماس دریافت‌شده از تلگرام
 */
function fillTelegramPhone(rawPhone) {
  if (!rawPhone) return;
  let clean = String(rawPhone).replace(/[^\d+]/g, '');
  if (clean.startsWith("+98")) {
    clean = "0" + clean.slice(3);
  } else if (clean.startsWith("98") && clean.length === 12) {
    clean = "0" + clean.slice(2);
  } else if (clean.startsWith("0098")) {
    clean = "0" + clean.slice(4);
  } else if (!clean.startsWith("0") && clean.length === 10) {
    clean = "0" + clean;
  }
  handleGuestPhoneSync(clean);
  const resPhoneEl = document.getElementById("res-phone");
  const foodPhoneEl = document.getElementById("food-phone");
  if (resPhoneEl) resPhoneEl.value = clean;
  if (foodPhoneEl) foodPhoneEl.value = clean;
  state.reservation.phone = clean;
  state.foodOrder.phone = clean;
}

/**
 * نمایش نشان شناسایی حساب تلگرام جهت اطلاع مهمان و اطمینان از ارتباط مستقیم میزبان
 */
function updateTelegramUserBadges() {
  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || state.telegramUser;
  if (!tgUser) return;
  const username = tgUser.username || "";
  const badges = [
    document.getElementById("tg-user-badge-res"),
    document.getElementById("tg-user-badge-food")
  ];
  badges.forEach(badge => {
    if (!badge) return;
    if (username) {
      badge.style.display = "flex";
      badge.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#1f8578" style="flex-shrink: 0;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
        <span>حساب تلگرام شما: <strong>@${username}</strong> <span style="font-size: 10.5px; opacity: 0.85;">(میزبان در صورت نیاز مستقیماً به شما در تلگرام پیام خواهد داد)</span></span>
      `;
    } else {
      badge.style.display = "none";
    }
  });
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
  "screen-rooms": () => {
    if (state.roomSelectionSource === "food") {
      state.roomSelectionSource = null;
      return "screen-food";
    }
    return "screen-home";
  },
  "screen-room-detail": () => "screen-rooms",
  "screen-reservation": () => {
    if (state.reservationSourceScreen === "screen-food") {
      return "screen-food";
    }
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
    if (state.roomSelectionSource === "food") {
      state.screenStack = ["screen-home", "screen-food", "screen-rooms"];
    } else {
      state.screenStack = ["screen-home", "screen-rooms"];
    }
  } else if (screenId === "screen-room-detail") {
    if (state.roomSelectionSource === "food") {
      state.screenStack = ["screen-home", "screen-food", "screen-rooms", "screen-room-detail"];
    } else {
      state.screenStack = ["screen-home", "screen-rooms", "screen-room-detail"];
    }
  } else if (screenId === "screen-reservation") {
    if (state.reservationSourceScreen === "screen-food") {
      state.screenStack = ["screen-home", "screen-food", "screen-reservation"];
    } else if (state.reservationSourceScreen === "screen-room-detail") {
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
  hideToast();

  if (screenId === "screen-home") {
    try { closeMessageModal(); } catch (_) {}
    try { closeShamsiDatePicker(); } catch (_) {}
  }

  const currentScreenId = state.screenStack[state.screenStack.length - 1] || "screen-home";
  if (currentScreenId === screenId) {
    if (screenId === "screen-home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  if (screenId === "screen-food") {
    if (source === "screen-reservation") {
      state.foodReturnToReservation = true;
    } else if (source === "screen-home" || !source) {
      state.foodReturnToReservation = false;
    }
    // اطمینان از نمایش کامل منوی ۳۵ خوراک محلی به صورت پیش‌فرض
    state.foodCategoryFilter = "all";
    state.foodSearchQuery = "";
    const searchInput = document.getElementById("food-search-input");
    if (searchInput) searchInput.value = "";
  }

  if (screenId === "screen-reservation" && source) {
    state.reservationSourceScreen = source;
  }

  updateScreenStackFor(screenId);
  renderCurrentScreen();
}

function navigateBack() {
  triggerHaptic('light');
  hideToast();
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

  // مدیریت نمایش داک شناور اسکرول در صفحه غذا
  const foodScrollDock = document.getElementById("food-scroll-nav-dock");
  if (foodScrollDock) {
    foodScrollDock.style.display = (targetId === "screen-food") ? "flex" : "none";
  }

  // مدیریت نمایش بنر بازگشت به غذا در صفحه انتخاب اتاق‌ها
  const roomsFromFoodBanner = document.getElementById("rooms-from-food-banner");
  if (roomsFromFoodBanner) {
    roomsFromFoodBanner.style.display = (targetId === "screen-rooms" && state.roomSelectionSource === "food") ? "flex" : "none";
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

/**
 * تبدیل ارقام فارسی و عربی به انگلیسی
 */
function toEnglishDigits(str) {
  if (!str) return "";
  const persianMap = { "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };
  const arabicMap = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9" };
  return String(str)
    .replace(/[۰-۹]/g, c => persianMap[c] || c)
    .replace(/[٠-٩]/g, c => arabicMap[c] || c);
}

/**
 * پاکسازی و استانداردسازی شماره تلفن همراه:
 * - تبدیل اعداد فارسی/عربی به انگلیسی
 * - حذف کاراکترهای غیررقمی
 * - اصلاح انواع پیش‌شماره‌های بین‌المللی (+98, 0098, 98) به 09
 * - پذیرش شماره‌های بدون صفر آغازین (912...)
 */
function sanitizeIranianPhone(input) {
  if (!input) return "";
  const english = toEnglishDigits(String(input).trim());
  let digits = english.replace(/\D/g, "");
  
  // تبدیل پیش‌شماره بین‌المللی 0098 به 0
  if (digits.startsWith("0098")) {
    digits = "0" + digits.slice(4);
  }
  // تبدیل پیش‌شماره بین‌المللی 98 به 0 (مثلا 989123456789 -> 09123456789)
  else if (digits.startsWith("989") && digits.length >= 12) {
    digits = "0" + digits.slice(2);
  } else if (digits.startsWith("98") && digits.length === 12) {
    digits = "0" + digits.slice(2);
  }
  // اگر کاربر شماره را بدون صفر آغازین وارد کرد (مثلاً 9123456789)
  else if (digits.startsWith("9") && digits.length === 10) {
    digits = "0" + digits;
  }
  
  return digits;
}

/**
 * اعتبارسنجی دقیق شماره همراه ایرانی:
 * شماره باید دقیقاً ۱۱ رقم بوده و با ۰۹ شروع شود. هر مقداری کمتر یا بیشتر از ۱۱ رقم غیرمجاز است.
 */
function validateIranianMobile(phone) {
  if (!phone || String(phone).trim() === "") {
    return { valid: false, error: "لطفاً شماره تماس (موبایل) خود را وارد کنید." };
  }
  const digits = sanitizeIranianPhone(phone);

  if (!digits.startsWith("09")) {
    return { valid: false, error: "شماره موبایل باید با ۰۹ شروع شود (مثال: ۰۹۱۲۳۴۵۶۷۸۹)." };
  }

  if (digits.length < 11) {
    return { valid: false, error: `شماره موبایل ناقص است (${formatPersianNumber(digits.length)} رقم وارد شده؛ باید دقیقاً ۱۱ رقم باشد).` };
  }

  if (digits.length > 11) {
    return { valid: false, error: `شماره موبایل بیشتر از ۱۱ رقم است (${formatPersianNumber(digits.length)} رقم وارد شده؛ باید دقیقاً ۱۱ رقم باشد).` };
  }

  return { valid: true, phone: digits };
}

function isValidIranianMobile(phone) {
  return validateIranianMobile(phone).valid;
}

function formatToman(amount) {
  const parts = Number(amount).toLocaleString('en-US');
  return formatPersianNumber(parts) + " تومان";
}

/**
 * تبدیل تاریخ میلادی (رشته یا شیء Date) به جزئیات کامل تقویم خورشیدی (شمسی) و روز هفته
 */
function getJalaliDetails(dateObjOrStr) {
  let d;
  if (!dateObjOrStr) {
    d = new Date();
  } else if (typeof dateObjOrStr === 'string') {
    const parts = dateObjOrStr.split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
    } else {
      d = new Date(dateObjOrStr);
    }
  } else {
    d = new Date(dateObjOrStr);
  }

  if (isNaN(d.getTime())) {
    d = new Date();
  }

  const dayIndex = d.getDay(); // 0 is Sunday, 6 is Saturday
  const daysMap = { 6: "شنبه", 0: "یکشنبه", 1: "دوشنبه", 2: "سه‌شنبه", 3: "چهارشنبه", 4: "پنج‌شنبه", 5: "جمعه" };
  const weekdayName = daysMap[dayIndex] || "نامشخص";

  // وسط هفته و غیر تعطیل: از شنبه تا سه‌شنبه (۶، ۰، ۱، ۲)
  const isMidweek = [6, 0, 1, 2].includes(dayIndex);

  try {
    const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const parts = formatter.formatToParts(d);
    const partMap = {};
    parts.forEach(p => partMap[p.type] = p.value);

    const numFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const numericDate = numFormatter.format(d);
    const fullString = `${weekdayName} ${partMap.day} ${partMap.month} ${partMap.year}`;
    const dateOnlyString = `${partMap.day} ${partMap.month} ${partMap.year}`;

    return {
      date: d,
      weekday: weekdayName,
      day: partMap.day,
      month: partMap.month,
      year: partMap.year,
      numericDate: numericDate,
      fullString: fullString,
      dateOnlyString: dateOnlyString,
      isMidweek: isMidweek,
      dayIndex: dayIndex
    };
  } catch (err) {
    // الگوریتم محاسباتی تبدیل میلادی به جلالی در صورت عدم پشتیبانی مرورگر
    const gy = d.getFullYear();
    const gm = d.getMonth() + 1;
    const gd = d.getDate();
    const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
    let jy = -1595 + (33 * Math.floor(days / 12053));
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    let jm, jd;
    if (days < 186) {
      jm = 1 + Math.floor(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    const months = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];
    const monthName = months[jm - 1] || "";
    const pYear = formatPersianNumber(jy);
    const pMonth = formatPersianNumber(String(jm).padStart(2, '0'));
    const pDay = formatPersianNumber(String(jd).padStart(2, '0'));

    return {
      date: d,
      weekday: weekdayName,
      day: pDay,
      month: monthName,
      year: pYear,
      numericDate: `${pYear}/${pMonth}/${pDay}`,
      fullString: `${weekdayName} ${pDay} ${monthName} ${pYear}`,
      dateOnlyString: `${pDay} ${monthName} ${pYear}`,
      isMidweek: isMidweek,
      dayIndex: dayIndex
    };
  }
}

/**
 * دریافت اجزای عددی سال، ماه و روز خورشیدی (شمسی)
 */
function getJalaliNumeric(dateObjOrStr) {
  let d;
  if (!dateObjOrStr) {
    d = new Date();
  } else if (typeof dateObjOrStr === 'string') {
    const parts = dateObjOrStr.split('-');
    if (parts.length === 3) {
      d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
    } else {
      d = new Date(dateObjOrStr);
    }
  } else {
    d = new Date(dateObjOrStr);
  }

  const gy = d.getFullYear();
  const gm = d.getMonth() + 1;
  const gd = d.getDate();
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { year: jy, month: jm, day: jd };
}

/**
 * تبدیل اجزای تاریخ جلالی به رشته استاندارد میلادی (YYYY-MM-DD)
 */
function jalaliToGregorian(jy, jm, jd) {
  jy += 1595;
  let days = -355668 + (365 * jy) + Math.floor((jy + 3) / 4) - Math.floor((jy + 99) / 100) + Math.floor((jy + 399) / 400) + jd;
  if (jm < 7) {
    days += (jm - 1) * 31;
  } else {
    days += ((jm - 7) * 30) + 186;
  }
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && days >= sal_a[gm]) {
    days -= sal_a[gm];
    gm++;
  }
  let gd = days + 1;
  const mm = String(gm).padStart(2, '0');
  const dd = String(gd).padStart(2, '0');
  return gy + '-' + mm + '-' + dd;
}

/**
 * تشخیص سال کبیسه در تقویم خورشیدی
 */
function isLeapJalaliYear(jy) {
  const remainder = (jy * 682) % 2816;
  return remainder < 682;
}

// وضعیت و متغیرهای تقویم اختصاصی شمسی
let shamsiCalTarget = "reservation"; // 'reservation' | 'food'
let shamsiCalCurrentYear = 1405;
let shamsiCalCurrentMonth = 6; // 1 to 12
const JALALI_MONTH_NAMES = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"];

function getMaxCheckInDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 60); // حداکثر تا ۲ ماه آینده (۶۰ روز)
  const gy = d.getFullYear();
  const gm = String(d.getMonth() + 1).padStart(2, '0');
  const gd = String(d.getDate()).padStart(2, '0');
  return `${gy}-${gm}-${gd}`;
}

function openShamsiDatePicker(target) {
  shamsiCalTarget = target || "reservation";
  triggerHaptic('light');

  const currentDateStr = shamsiCalTarget === "food" 
    ? (state.foodOrder.date || getTodayFormattedDate()) 
    : (state.reservation.checkInDate || getTodayFormattedDate());

  const jNum = getJalaliNumeric(currentDateStr);
  shamsiCalCurrentYear = jNum.year;
  shamsiCalCurrentMonth = jNum.month;

  renderShamsiCalendar();
  const modal = document.getElementById("shamsi-datepicker-modal");
  if (modal) modal.classList.add("active");
}

function closeShamsiDatePicker() {
  triggerHaptic('light');
  const modal = document.getElementById("shamsi-datepicker-modal");
  if (modal) modal.classList.remove("active");
}

function changeShamsiCalendarMonth(delta) {
  triggerHaptic('light');
  let nextMonth = shamsiCalCurrentMonth + delta;
  let nextYear = shamsiCalCurrentYear;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  } else if (nextMonth < 1) {
    nextMonth = 12;
    nextYear -= 1;
  }

  if (shamsiCalTarget === "reservation") {
    const todayJNum = getJalaliNumeric(getTodayFormattedDate());
    const maxJNum = getJalaliNumeric(getMaxCheckInDateString());
    const nextKey = nextYear * 12 + nextMonth;
    const minKey = todayJNum.year * 12 + todayJNum.month;
    const maxKey = maxJNum.year * 12 + maxJNum.month;

    if (nextKey < minKey) {
      showToast("امکان انتخاب ماه‌های گذشته وجود ندارد.");
      return;
    }
    if (nextKey > maxKey) {
      showToast("رزرو حداکثر تا ۲ ماه آینده امکان‌پذیر است.");
      return;
    }
  }

  shamsiCalCurrentMonth = nextMonth;
  shamsiCalCurrentYear = nextYear;
  renderShamsiCalendar();
}

function renderShamsiCalendar() {
  const headerTitle = document.getElementById("shamsi-cal-header-title");
  if (headerTitle) {
    headerTitle.textContent = `${JALALI_MONTH_NAMES[shamsiCalCurrentMonth - 1]} ${formatPersianNumber(shamsiCalCurrentYear)}`;
  }

  const grid = document.getElementById("shamsi-cal-days-grid");
  if (!grid) return;

  // تعداد روزهای ماه شمسی
  let daysInMonth = 30;
  if (shamsiCalCurrentMonth <= 6) {
    daysInMonth = 31;
  } else if (shamsiCalCurrentMonth === 12) {
    daysInMonth = isLeapJalaliYear(shamsiCalCurrentYear) ? 30 : 29;
  }

  // تاریخ روز اول ماه
  const firstDayGStr = jalaliToGregorian(shamsiCalCurrentYear, shamsiCalCurrentMonth, 1);
  const firstDayDate = new Date(firstDayGStr + 'T12:00:00');
  const gDay = firstDayDate.getDay(); // Sunday=0, ..., Saturday=6
  const startDayOffset = (gDay + 1) % 7; // شنبه=0, یکشنبه=1, ..., جمعه=6

  const currentSelectedGStr = shamsiCalTarget === "food" ? state.foodOrder.date : state.reservation.checkInDate;
  const todayGStr = getTodayFormattedDate();
  const maxDateStr = getMaxCheckInDateString();

  let html = "";

  // خانه‌های خالی ابتدای تقویم
  for (let i = 0; i < startDayOffset; i++) {
    html += `<div class="shamsi-day-btn empty"></div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayGStr = jalaliToGregorian(shamsiCalCurrentYear, shamsiCalCurrentMonth, d);
    const dayOfWeekIndex = (startDayOffset + d - 1) % 7;
    const isFriday = dayOfWeekIndex === 6;
    const isMidweek = [0, 1, 2, 3].includes(dayOfWeekIndex); // شنبه تا سه‌شنبه (تخفیف ۱۰٪)
    const isSelected = dayGStr === currentSelectedGStr;
    const isToday = dayGStr === todayGStr;
    const isPast = dayGStr < todayGStr;
    const isTooFar = dayGStr > maxDateStr;
    const isDisabled = (shamsiCalTarget === "reservation") && (isPast || isTooFar);

    if (isDisabled) {
      const reason = isPast ? 'تاریخ گذشته' : 'بیش از ۲ ماه آینده';
      html += `
        <button type="button" class="shamsi-day-btn disabled-day" disabled title="${d} ${JALALI_MONTH_NAMES[shamsiCalCurrentMonth - 1]} (${reason})" style="opacity: 0.28; cursor: not-allowed; background: rgba(0,0,0,0.03); color: #888; text-decoration: line-through; border: none;">
          <span>${formatPersianNumber(d)}</span>
        </button>
      `;
    } else {
      const classes = [
        "shamsi-day-btn",
        isSelected ? "selected" : "",
        isToday ? "today" : "",
        isFriday ? "friday" : "",
        isMidweek ? "midweek" : ""
      ].filter(Boolean).join(" ");

      html += `
        <button type="button" class="${classes}" onclick="selectShamsiCalendarDay(${shamsiCalCurrentYear}, ${shamsiCalCurrentMonth}, ${d}, '${dayGStr}')" title="${d} ${JALALI_MONTH_NAMES[shamsiCalCurrentMonth - 1]}${isMidweek ? ' (مشمول تخفیف وسط هفته)' : ''}">
          <span>${formatPersianNumber(d)}</span>
        </button>
      `;
    }
  }

  grid.innerHTML = html;
}

function selectShamsiCalendarDay(year, month, day, gregorianDateStr) {
  triggerHaptic('medium');
  const todayGStr = getTodayFormattedDate();
  const maxDateStr = getMaxCheckInDateString();

  if (shamsiCalTarget === "reservation" || shamsiCalTarget === "food-stay") {
    if (gregorianDateStr < todayGStr) {
      showToast("تاریخ ورود نمی‌تواند قبل از امروز باشد.");
      return;
    }
    if (gregorianDateStr > maxDateStr) {
      showToast("رزرو حداکثر تا ۲ ماه آینده امکان‌پذیر می‌باشد.");
      return;
    }
    state.reservation.checkInDate = gregorianDateStr;
    state.foodOrder.date = gregorianDateStr;
    updateReservationCalculations();
    renderFoodSection();
    updateFoodOrderSummary();
    const jDetails = getJalaliDetails(gregorianDateStr);
    showToast(`تاریخ ورود اقامت: ${jDetails.fullString}`);
  } else if (shamsiCalTarget === "food") {
    state.foodOrder.date = gregorianDateStr;
    handleFoodDateChange(gregorianDateStr);
    const jDetails = getJalaliDetails(gregorianDateStr);
    showToast(`تاریخ وعده غذایی: ${jDetails.fullString}`);
  }
  closeShamsiDatePicker();
}

function pickQuickShamsiDate(daysFromNow) {
  triggerHaptic('medium');
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const gy = d.getFullYear();
  const gm = String(d.getMonth() + 1).padStart(2, '0');
  const gd = String(d.getDate()).padStart(2, '0');
  const gStr = `${gy}-${gm}-${gd}`;
  const jNum = getJalaliNumeric(gStr);
  selectShamsiCalendarDay(jNum.year, jNum.month, jNum.day, gStr);
}

/**
 * دریافت تاریخ و زمان فعلی به تقویم شمسی همراه با ساعت و دقیقه
 * مثال: سه‌شنبه ۱۷ شهریور ۱۴۰۵ - ساعت ۱۸:۳۰
 */
function getJalaliNowString() {
  const now = new Date();
  const details = getJalaliDetails(now);
  const hour = formatPersianNumber(String(now.getHours()).padStart(2, "0"));
  const minute = formatPersianNumber(String(now.getMinutes()).padStart(2, "0"));
  return `${details.fullString} - ساعت ${hour}:${minute}`;
}

/**
 * محاسبه هزینه یک شب برای یک اتاق بر اساس تعداد نفرات انتخابی:
 * - تا سقف ظرفیت اصلی (پایه) با نرخ اصلی هر نفر/شب
 * - نفرات اضافه (مازاد بر ظرفیت اصلی تا سقف ظرفیت کل) با ۱۰٪ تخفیف نسبت به ظرفیت اصلی
 */
function calculateRoomNightCost(room, guestsCount) {
  if (!room) return { cost: 0, baseGuests: 0, extraGuests: 0, actualGuests: 0, basePrice: 0, extraPrice: 0, baseCap: 0, extraCap: 0, maxCap: 0 };
  const baseCap = room.baseCapacity || room.capacity || 2;
  const extraCap = room.extraCapacityCount !== undefined ? room.extraCapacityCount : 0;
  const maxCap = room.maxCapacity || (baseCap + extraCap);
  
  const g = typeof guestsCount === "number" && !isNaN(guestsCount) ? guestsCount : baseCap;
  const actualGuests = Math.min(Math.max(1, g), maxCap);
  
  const baseGuests = Math.min(actualGuests, baseCap);
  const extraGuests = Math.max(0, actualGuests - baseCap);
  
  const basePrice = room.price || 1300000;
  const extraPrice = Math.round(basePrice * 0.90); // ۱۰ درصد کمتر از ظرفیت اصلی
  
  const cost = (baseGuests * basePrice) + (extraGuests * extraPrice);
  return {
    cost,
    baseGuests,
    extraGuests,
    actualGuests,
    basePrice,
    extraPrice,
    baseCap,
    extraCap,
    maxCap
  };
}

/**
 * محاسبه تخفیف اقامت طبق ضوابط خانه برزک:
 * "برای روزهای وسط هفته و غیر تعطیل (از شنبه تا سه‌شنبه) ۱۰ درصد تخفیف، و برای اقامت بیش از یک شب ۱۰ درصد تخفیف در شب دوم در نظر گرفته می‌شود."
 */
function calculateStayDiscount(checkInDateStr, nights, guests, customNightCost) {
  const selectedRooms = (state.reservation && state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  let nightBaseCost = 0;
  if (typeof customNightCost === "number" && customNightCost > 0) {
    nightBaseCost = customNightCost;
  } else if (selectedRooms.length > 0) {
    nightBaseCost = selectedRooms.reduce((sum, r) => {
      const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
      const breakdown = calculateRoomNightCost(r, g);
      return sum + breakdown.cost;
    }, 0);
  } else {
    nightBaseCost = 0;
  }

  const totalBaseRoom = Math.max(0, nights * nightBaseCost);
  let totalDiscount = 0;
  const breakdown = [];

  if (!checkInDateStr) {
    return {
      nightBaseCost,
      totalBaseRoom,
      totalDiscount: 0,
      finalRoomTotal: totalBaseRoom,
      breakdown: [],
      hasDiscount: false,
      hasMidweekDiscount: false,
      hasSecondNightDiscount: false,
      summaryText: ""
    };
  }

  for (let i = 0; i < nights; i++) {
    const curDateStr = addDaysToDateString(checkInDateStr, i);
    const details = getJalaliDetails(curDateStr);
    let discountPct = 0;
    let reason = "";

    // قانون ۱: برای اقامت بیش از یک شب، ۱۰ درصد تخفیف در شب دوم
    if (i === 1) {
      discountPct = 0.10;
      reason = "۱۰٪ تخفیف شب دوم (اقامت بیش از یک شب)";
    }
    // قانون ۲: برای روزهای وسط هفته و غیر تعطیل (از شنبه تا سه‌شنبه) ۱۰ درصد تخفیف
    else if (details.isMidweek) {
      discountPct = 0.10;
      reason = "۱۰٪ تخفیف روز وسط هفته (از شنبه تا سه‌شنبه)";
    }

    const nightDisc = Math.round(nightBaseCost * discountPct);
    totalDiscount += nightDisc;

    breakdown.push({
      nightIndex: i + 1,
      dateStr: curDateStr,
      weekday: details.weekday,
      jalali: details.fullString,
      isMidweek: details.isMidweek,
      discountPct: discountPct * 100,
      discountAmount: nightDisc,
      reason: reason
    });
  }

  const finalRoomTotal = Math.max(0, totalBaseRoom - totalDiscount);
  return {
    nightBaseCost,
    totalBaseRoom,
    totalDiscount,
    finalRoomTotal,
    hasDiscount: totalDiscount > 0,
    breakdown
  };
}

/**
 * تغییر دستی تاریخ ورود در فرم رزرو اقامت
 */
function handleReservationCheckInChange(val) {
  state.reservation.checkInDate = val;
  state.foodOrder.date = val;
  const foodDateInput = document.getElementById("food-date");
  if (foodDateInput) foodDateInput.value = val;
  updateReservationCalculations();
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
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            ${isSelected ? `
              <button type="button" class="btn btn-primary" onclick="${state.roomSelectionSource === 'food' ? 'returnToFoodFromRooms()' : 'openReservationScreen()'}" style="flex: 1; font-size: 13px; padding: 8px 10px;">
                ${state.roomSelectionSource === 'food' ? '✓ انتخاب شده (بازگشت به غذا ↵)' : '✓ در لیست رزرو (تکمیل)'}
              </button>
            ` : `
              <button type="button" class="btn btn-mustard" onclick="selectRoomAndBook('${room.id}')" style="flex: 1; font-size: 13px; padding: 8px 10px;">
                ${state.roomSelectionSource === 'food' ? `➕ افزودن به سفارش غذا ←` : `رزرو اتاق ${room.name} ←`}
              </button>
            `}
            <button type="button" class="btn btn-outline" onclick="openRoomDetail('${room.id}')" style="font-size: 12px; padding: 8px 10px; white-space: nowrap;">
              مشخصات و تصاویر
            </button>
          </div>
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
    detailPriceNote.textContent = "🏷️ برای روزهای وسط هفته و غیر تعطیل (از شنبه تا سه‌شنبه) ۱۰ درصد تخفیف، و برای اقامت بیش از یک شب ۱۰ درصد تخفیف در شب دوم در نظر گرفته می‌شود.";
    detailPriceNote.style.display = "block";
    detailPriceNote.style.color = "#825e1a";
    detailPriceNote.style.fontSize = "11.5px";
    detailPriceNote.style.marginTop = "6px";
    detailPriceNote.style.lineHeight = "1.5";
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
  if (!state.reservation.roomGuests) {
    state.reservation.roomGuests = {};
  }
  if (!state.reservation.roomCounts) {
    state.reservation.roomCounts = {};
  }

  if (!state.reservation.selectedRoomIds.includes(roomId)) {
    state.reservation.selectedRoomIds.push(roomId);
    state.reservation.roomGuests[roomId] = room.baseCapacity || 2;
    state.reservation.roomCounts[roomId] = 1;
    showToast(`اتاق ${room.name} (${formatPersianNumber(state.reservation.roomGuests[roomId])} نفر) به لیست رزرو اضافه شد.`);
  } else {
    showToast(`اتاق ${room.name} در لیست رزرو شماست (${formatPersianNumber(state.reservation.roomGuests[roomId] || room.baseCapacity)} نفر).`);
  }

  state.floatingBarDismissed = false;
  updateRoomDetailButtons();
  updateFloatingBookingBar();
  renderRoomsList();
  updateReservationCalculations();
}

function startReservationForCurrentRoom() {
  handleRoomDetailBookingClick();
  if (state.roomSelectionSource === "food") {
    state.roomSelectionSource = null;
    renderFoodSection();
    updateFoodOrderSummary();
    navigateTo("screen-food");
    showToast("اتاق با موفقیت به سفارش شما افزوده شد.");
    return;
  }
  openReservationScreen();
}

function openReservationScreen() {
  triggerHaptic('light');
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  navigateTo("screen-reservation");
}

function selectRoomAndBook(roomId) {
  triggerHaptic('medium');
  state.selectedRoomId = roomId;
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;

  if (!state.reservation.selectedRoomIds) {
    state.reservation.selectedRoomIds = [];
  }
  if (!state.reservation.roomGuests) {
    state.reservation.roomGuests = {};
  }
  if (!state.reservation.roomCounts) {
    state.reservation.roomCounts = {};
  }

  if (!state.reservation.selectedRoomIds.includes(roomId)) {
    state.reservation.selectedRoomIds.push(roomId);
    state.reservation.roomGuests[roomId] = room.baseCapacity || 2;
    state.reservation.roomCounts[roomId] = 1;
    showToast(`اتاق ${room.name} (${formatPersianNumber(state.reservation.roomGuests[roomId])} نفر) انتخاب شد.`);
  }

  state.floatingBarDismissed = false;
  updateFloatingBookingBar();
  renderRoomsList();

  if (state.roomSelectionSource === "food") {
    state.roomSelectionSource = null;
    renderFoodSection();
    updateFoodOrderSummary();
    navigateTo("screen-food");
    showToast(`اتاق «${room.name}» با موفقیت به سفارش شما افزوده شد.`);
    return;
  }

  openReservationScreen();
}

function changeRoomGuests(roomId, delta) {
  triggerHaptic('light');
  if (!state.reservation.roomGuests) {
    state.reservation.roomGuests = {};
  }
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;

  const baseCap = room.baseCapacity || room.capacity || 2;
  const extraCap = room.extraCapacityCount !== undefined ? room.extraCapacityCount : 0;
  const maxCap = room.maxCapacity || (baseCap + extraCap);

  const current = state.reservation.roomGuests[roomId] || baseCap;
  const next = current + delta;

  if (next < 1) {
    showToast(`حداقل تعداد نفرات برای هر اتاق ۱ نفر است.`);
    return;
  }
  if (next > maxCap) {
    showToast(`حداکثر ظرفیت اتاق ${room.name} برابر ${formatPersianNumber(maxCap)} نفر (${formatPersianNumber(baseCap)} نفر اصلی + ${formatPersianNumber(extraCap)} نفر اضافه) است.`);
    return;
  }

  state.reservation.roomGuests[roomId] = next;
  if (state.reservation.roomCounts) {
    state.reservation.roomCounts[roomId] = 1;
  }

  if (delta > 0 && next > baseCap) {
    showToast(`${formatPersianNumber(next - baseCap)} نفر اضافه در اتاق ${room.name} (با ۱۰٪ تخفیف) محاسبه شد.`);
  }

  renderSelectedRoomsInForm();
  updateReservationCalculations();
}

// تابع جایگزین جهت حفظ سازگاری با فراخوانی‌های قبلی
function changeRoomCount(roomId, delta) {
  changeRoomGuests(roomId, delta);
}

function removeRoomFromReservation(roomId) {
  triggerHaptic('light');
  const room = ROOMS.find(r => r.id === roomId);
  if (state.reservation.selectedRoomIds) {
    state.reservation.selectedRoomIds = state.reservation.selectedRoomIds.filter(id => id !== roomId);
  }
  if (state.reservation.roomGuests) {
    delete state.reservation.roomGuests[roomId];
  }
  if (state.reservation.roomCounts) {
    delete state.reservation.roomCounts[roomId];
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

  const totalGuests = selectedRooms.reduce((sum, r) => {
    return sum + ((state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2);
  }, 0);
  state.reservation.guests = totalGuests;

  const roomsListHtml = selectedRooms.map(room => {
    const guests = (state.reservation.roomGuests && state.reservation.roomGuests[room.id]) || room.baseCapacity || 2;
    const costInfo = calculateRoomNightCost(room, guests);
    const isExtra = costInfo.extraGuests > 0;
    const isAtMax = guests >= costInfo.maxCap;
    const isAtMin = guests <= 1;

    return `
      <div class="selected-room-chip" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: #ffffff; border: 1px solid var(--brand-border); border-radius: var(--radius-md); margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-weight: 800; font-size: 14px; color: var(--brand-green);">🏠 اتاق ${room.name}</span>
            <span style="font-size: 11px; color: var(--brand-text-muted); margin-right: 6px;">(ظرفیت پایه: ${formatPersianNumber(costInfo.baseCap)} نفر${costInfo.extraCap > 0 ? ` + تا ${formatPersianNumber(costInfo.extraCap)} نفر اضافه` : ''})</span>
          </div>
          <button type="button" class="selected-room-remove-btn" onclick="removeRoomFromReservation('${room.id}')" title="حذف این اتاق از رزرو" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #e2ddd3; background: #faf8f5; color: #8a8275; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">✕</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #fbf9f4; border: 1px solid #edd9b8; padding: 8px 12px; border-radius: 8px;">
          <div>
            <span style="font-size: 12.5px; font-weight: 800; color: var(--brand-green);">تعداد نفرات این اتاق:</span>
            <span style="font-size: 10.5px; color: var(--brand-text-muted); display: block;">(حداکثر ${formatPersianNumber(costInfo.maxCap)} نفر)</span>
          </div>
          <div class="room-booking-counter" title="تعداد نفرات اتاق ${room.name}" style="display: inline-flex; align-items: center; gap: 6px;">
            <button type="button" class="room-counter-btn" onclick="changeRoomGuests('${room.id}', -1)" title="کاهش نفرات" ${isAtMin ? 'disabled style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e5e5e5; background: #f3f3f3; color: #bbb; font-weight: bold; font-size: 15px; cursor: not-allowed; display: flex; align-items: center; justify-content: center;"' : 'style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #ccc; background: #fff; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;"'}>−</button>
            <span style="font-weight: 800; font-size: 14.5px; color: var(--brand-green); min-width: 46px; text-align: center;">${formatPersianNumber(guests)} نفر</span>
            <button type="button" class="room-counter-btn" onclick="changeRoomGuests('${room.id}', 1)" title="افزایش نفرات" ${isAtMax ? 'disabled style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e5e5e5; background: #f3f3f3; color: #bbb; font-weight: bold; font-size: 15px; cursor: not-allowed; display: flex; align-items: center; justify-content: center;"' : 'style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #ccc; background: #fff; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;"'}>+</button>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; padding: 2px 4px 0 4px;">
          <div>
            ${isExtra 
              ? `<span style="color: #276749; font-weight: 700; background: #edf7ee; padding: 2px 7px; border-radius: 5px; border: 1px solid #c9e8cd;">${formatPersianNumber(costInfo.baseGuests)} نفر پایه + ${formatPersianNumber(costInfo.extraGuests)} نفر اضافه (۱۰٪ تخفیف)</span>`
              : `<span style="color: var(--brand-text-muted);">${formatPersianNumber(costInfo.baseGuests)} نفر (ظرفیت پایه با صبحانه)</span>`
            }
          </div>
          <div style="font-weight: 800; color: var(--brand-green);">
            ${formatToman(costInfo.cost)} <small style="font-size: 10.5px; font-weight: normal; color: var(--brand-text-muted);">/ شب</small>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = roomsListHtml;
}

function dismissFloatingBookingBar(e) {
  if (e) e.stopPropagation();
  triggerHaptic('light');
  state.floatingBarDismissed = true;
  const bar = document.getElementById("floating-booking-bar");
  if (bar) bar.style.display = "none";
  if (document.body && document.body.classList) {
    document.body.classList.remove("has-floating-bar");
  }
}

function updateFloatingBookingBar() {
  const bar = document.getElementById("floating-booking-bar");
  if (!bar) return;

  const currentScreenId = state.screenStack[state.screenStack.length - 1];
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  if (selectedRooms.length > 0 && currentScreenId !== "screen-reservation" && !state.floatingBarDismissed) {
    bar.style.display = "flex";
    if (document.body && document.body.classList) {
      document.body.classList.add("has-floating-bar");
    }
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
    if (document.body && document.body.classList) {
      document.body.classList.remove("has-floating-bar");
    }
  }
}

// ۹. فرم و محاسبات درخواست رزرو یکپارچه (اقامت + خوراک)
function updateReservationCalculations() {
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  const checkInInput = document.getElementById("res-checkin-date");
  const checkInVal = (checkInInput && checkInInput.value) ? checkInInput.value : state.reservation.checkInDate;
  
  const checkInShamsiText = document.getElementById("res-checkin-shamsi-text");
  const checkOutShamsiText = document.getElementById("res-checkout-shamsi-text");

  if (checkInVal) {
    // محاسبه خودکار تاریخ خروج بر اساس تاریخ ورود و تعداد شب
    const checkOutVal = addDaysToDateString(checkInVal, state.reservation.nights);
    state.reservation.checkInDate = checkInVal;
    state.reservation.checkOutDate = checkOutVal;

    const checkInJalali = getJalaliDetails(checkInVal);
    const checkOutJalali = getJalaliDetails(checkOutVal);

    if (checkInShamsiText) {
      checkInShamsiText.textContent = `${checkInJalali.fullString} (${checkInJalali.numericDate})`;
      checkInShamsiText.style.color = "var(--brand-teal-dark)";
    }

    if (checkOutShamsiText) {
      checkOutShamsiText.textContent = checkOutJalali.fullString;
    }
  } else {
    state.reservation.checkOutDate = "";
    if (checkInShamsiText) {
      checkInShamsiText.textContent = "انتخاب در تقویم شمسی...";
      checkInShamsiText.style.color = "var(--brand-text-muted)";
    }
    if (checkOutShamsiText) {
      checkOutShamsiText.textContent = "محاسبه بر اساس ورود";
    }
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

  // ۱. محاسبه و تجمیع کل نفرات از اتاق‌های انتخاب شده
  let calculatedTotalGuests = 0;
  if (selectedRooms.length > 0) {
    selectedRooms.forEach(r => {
      const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
      calculatedTotalGuests += g;
    });
    state.reservation.guests = calculatedTotalGuests;
  } else {
    state.reservation.guests = 0;
  }

  // نمایش تعداد شب و نفرات در استپرها
  const nightsValEl = document.getElementById("res-nights-val");
  if (nightsValEl) {
    nightsValEl.textContent = formatPersianNumber(state.reservation.nights) + " شب";
  }

  const guestsValEl = document.getElementById("res-guests-val");
  if (guestsValEl) {
    guestsValEl.textContent = state.reservation.guests > 0 
      ? formatPersianNumber(state.reservation.guests) + " نفر" 
      : "انتخاب اتاق";
  }

  // محاسبه مبلغ اقامت و تخفیف اقامت (وسط هفته غیرتعطیل ۱۰٪ و اقامت بیش از ۱ شب ۲۰٪ در شب دوم)
  const discountData = calculateStayDiscount(checkInVal, state.reservation.nights, state.reservation.guests);
  const roomEstimate = discountData.finalRoomTotal;
  const roomBaseTotal = discountData.totalBaseRoom;
  const totalDiscount = discountData.totalDiscount;

  // وضعیت کارت تخفیف
  const discountStatusBadge = document.getElementById("res-discount-status-badge");
  if (discountStatusBadge) {
    discountStatusBadge.style.display = "block";
    if (!checkInVal) {
      discountStatusBadge.style.background = "#fdfbf7";
      discountStatusBadge.style.color = "#825e1a";
      discountStatusBadge.style.borderColor = "#ebd9b5";
      discountStatusBadge.innerHTML = `ℹ️ با انتخاب تاریخ ورود از تقویم، تخفیف‌های احتمالی روزهای اقامت (شنبه تا سه‌شنبه ۱۰٪ و اقامت بیش از یک شب ۱۰٪ در شب دوم) به صورت خودکار محاسبه می‌شوند.`;
    } else if (discountData.hasDiscount) {
      discountStatusBadge.style.background = "#eef7f2";
      discountStatusBadge.style.color = "var(--brand-green)";
      discountStatusBadge.style.borderColor = "#c7e6d5";
      const reasons = discountData.breakdown.filter(b => b.discountAmount > 0).map(b => b.reason).join(" و ");
      discountStatusBadge.innerHTML = `✅ <b>مشمول تخفیف:</b> مبلغ ${formatToman(totalDiscount)} تخفیف برای این اقامت برآورد شد (${reasons}). اعمال نهایی توسط میزبان انجام می‌گیرد.`;
    } else {
      discountStatusBadge.style.background = "#fdfbf7";
      discountStatusBadge.style.color = "#825e1a";
      discountStatusBadge.style.borderColor = "#ebd9b5";
      discountStatusBadge.innerHTML = `ℹ️ تاریخ‌های انتخابی در ایام آخر هفته یا تعطیل است. برای روزهای شنبه تا سه‌شنبه ۱۰٪ و برای اقامت بیش از یک شب ۱۰٪ تخفیف در شب دوم در نظر گرفته می‌شود.`;
    }
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
      const sortedScheduled = sortScheduledMealsChronologically(scheduled);
      if (sortedScheduled.length > 0) {
        mealsSummaryHtml += sortedScheduled.map((m, idx) => {
          const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
          const dishesNames = m.dishes.map(d => `${d.name} (${formatPersianNumber(d.quantity)} پرس)`).join("، ");
          const mJalali = getJalaliDetails(m.date);
          return `
            <div class="unified-food-item">
              <span>${icon} وعده ${formatPersianNumber(idx + 1)} (${m.mealType} ${mJalali.weekday} ${mJalali.dateOnlyString}): ${dishesNames}</span>
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
        const curDateJalali = getJalaliDetails(state.foodOrder.date || checkInVal);
        mealsSummaryHtml += `
          <div class="unified-food-item" style="color: var(--brand-teal-dark); font-weight: 700;">
            <span>${icon} وعده جاری (${state.foodOrder.mealType || 'ناهار'} ${curDateJalali.weekday}): ${currentDishesNames}</span>
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
  const summaryDiscountRowEl = document.getElementById("res-summary-discount-row");
  const summaryDiscountPriceEl = document.getElementById("res-summary-discount-price");
  const summaryFoodRowEl = document.getElementById("res-summary-food-row");
  const summaryFoodTitleEl = document.getElementById("res-summary-food-title");
  const summaryFoodPriceEl = document.getElementById("res-summary-food-price");
  const summaryTotalEl = document.getElementById("res-summary-total");

  if (summaryRoomEl) {
    if (selectedRooms.length === 0) {
      summaryRoomEl.textContent = "اتاقی انتخاب نشده است";
    } else if (selectedRooms.length === 1) {
      const r = selectedRooms[0];
      const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
      summaryRoomEl.textContent = `اتاق ${r.name} (${formatPersianNumber(g)} نفر، ${formatPersianNumber(state.reservation.nights)} شب با صبحانه)`;
    } else {
      const roomDetails = selectedRooms.map(r => {
        const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
        return `${r.name} (${formatPersianNumber(g)} نفر)`;
      }).join(" + ");
      summaryRoomEl.textContent = `${formatPersianNumber(selectedRooms.length)} اتاق (${roomDetails}) - مجموعاً ${formatPersianNumber(state.reservation.guests)} نفر، ${formatPersianNumber(state.reservation.nights)} شب با صبحانه`;
    }
  }

  if (summaryRoomPriceEl) {
    if (totalDiscount > 0) {
      summaryRoomPriceEl.innerHTML = `<span style="text-decoration: line-through; opacity: 0.55; font-size: 12px; margin-left: 6px;">${formatToman(roomBaseTotal)}</span> ${formatToman(roomEstimate)}`;
    } else {
      summaryRoomPriceEl.textContent = formatToman(roomBaseTotal);
    }
  }

  if (summaryDiscountRowEl && summaryDiscountPriceEl) {
    if (totalDiscount > 0) {
      summaryDiscountRowEl.style.display = "flex";
      summaryDiscountPriceEl.textContent = `- ${formatToman(totalDiscount)}`;
    } else {
      summaryDiscountRowEl.style.display = "none";
    }
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
  let n = (state.reservation.nights || 1) + delta;
  if (n < 1) n = 1;
  if (n > 5) {
    showToast("حداکثر مدت اقامت ۵ شب می‌باشد.");
    n = 5;
  }
  state.reservation.nights = n;
  updateReservationCalculations();
}

function changeReservationGuests(delta) {
  triggerHaptic('light');
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);
  if (selectedRooms.length === 1) {
    changeRoomGuests(selectedRooms[0].id, delta);
    return;
  }
  if (selectedRooms.length > 1) {
    showToast("برای تغییر تعداد نفرات هر اتاق، از دکمه‌های + و − همان اتاق در بالا استفاده فرمایید.");
    return;
  }
  let g = (state.reservation.guests || 2) + delta;
  if (g < 1) g = 1;
  if (g > 20) g = 20;
  state.reservation.guests = g;
  updateReservationCalculations();
}

// اسکرول نرم به بالا یا پایین صفحه غذا
function scrollFoodScreen(direction) {
  try { triggerHaptic('light'); } catch (_) {}
  
  if (direction === 'top') {
    // ۱. اسکرول مستقیم پنجره و روت صفحه
    try { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, 0); }
    if (document.documentElement) {
      try { document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (_) {}
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      try { document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (_) {}
      document.body.scrollTop = 0;
    }
    if (document.scrollingElement) {
      try { document.scrollingElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); } catch (_) {}
      document.scrollingElement.scrollTop = 0;
    }

    // ۲. اسکرول به نقطه لنگر بالای صفحه غذا با scrollIntoView
    const topAnchor = document.getElementById('food-screen-top-anchor') ||
                      document.getElementById('food-stay-top-card') ||
                      document.getElementById('food-linked-stay-banner') ||
                      document.getElementById('screen-food');
    if (topAnchor) {
      try {
        topAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (_) {
        try { topAnchor.scrollIntoView(true); } catch (_) {}
      }
    }
  } else {
    // اسکرول مستقیم به فاکتور و دکمه ارسال سفارش در انتهای صفحه غذا
    const bottomTarget = document.getElementById('food-order-summary') || 
                         document.getElementById('btn-submit-food-order') || 
                         document.getElementById('food-order-form');
    if (bottomTarget) {
      try {
        bottomTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (_) {
        try { bottomTarget.scrollIntoView(false); } catch (_) {}
      }
    } else {
      const maxScroll = Math.max(document.body?.scrollHeight || 0, document.documentElement?.scrollHeight || 0, 10000);
      try { window.scrollTo({ top: maxScroll, behavior: 'smooth' }); } catch (_) { window.scrollTo(0, maxScroll); }
      if (document.documentElement) document.documentElement.scrollTop = maxScroll;
      if (document.body) document.body.scrollTop = maxScroll;
    }
  }
}
window.scrollFoodScreen = scrollFoodScreen;

// همگام‌سازی لحظه‌ای نام مهمان بین تمام فرم‌ها و استیت
function handleGuestNameSync(val) {
  const cleanVal = (val || "").trim();
  state.reservation.name = cleanVal;
  state.foodOrder.name = cleanVal;

  const resName = document.getElementById("res-name");
  const foodName = document.getElementById("food-name");
  if (resName && resName.value !== val) resName.value = val;
  if (foodName && foodName.value !== val) foodName.value = val;
}
window.handleGuestNameSync = handleGuestNameSync;

// همگام‌سازی لحظه‌ای شماره تماس بین تمام فرم‌ها و استیت
function handleGuestPhoneSync(val) {
  const cleanVal = (val || "").trim();
  state.reservation.phone = cleanVal;
  state.foodOrder.phone = cleanVal;

  const resPhone = document.getElementById("res-phone");
  const foodPhone = document.getElementById("food-phone");
  if (resPhone && resPhone.value !== val) resPhone.value = val;
  if (foodPhone && foodPhone.value !== val) foodPhone.value = val;
}
window.handleGuestPhoneSync = handleGuestPhoneSync;

// همگام‌سازی لحظه‌ای یادداشت‌ها و ملاحظات خاص مهمان بین تمام فرم‌ها و استیت
function handleGuestNotesSync(val) {
  const cleanVal = (val || "").trim();
  state.reservation.notes = cleanVal;
  state.foodOrder.notes = cleanVal;

  const resNotes = document.getElementById("res-notes");
  const foodNotes = document.getElementById("food-notes");
  if (resNotes && resNotes.value !== val) resNotes.value = val;
  if (foodNotes && foodNotes.value !== val) foodNotes.value = val;
}
window.handleGuestNotesSync = handleGuestNotesSync;

// هدایت کاربر از صفحه غذا به لیست اتاق‌ها جهت مشاهده و انتخاب اتاق
function openRoomsFromFood() {
  try { triggerHaptic('light'); } catch (_) {}
  state.roomSelectionSource = "food";
  syncFoodToReservationInputs();
  navigateTo("screen-rooms", "screen-food");
}
window.openRoomsFromFood = openRoomsFromFood;

// هدایت کاربر از صفحه غذا به فرم کامل رزرو اقامت
function openReservationFromFood() {
  try { triggerHaptic('light'); } catch (_) {}
  syncFoodToReservationInputs();
  state.reservationSourceScreen = "screen-food";
  state.foodReturnToReservation = true;
  navigateTo("screen-reservation", "screen-food");
}
window.openReservationFromFood = openReservationFromFood;

// بازگشت از لیست اتاق‌ها به صفحه غذا
function returnToFoodFromRooms() {
  try { triggerHaptic('light'); } catch (_) {}
  state.roomSelectionSource = null;
  renderFoodSection();
  updateFoodOrderSummary();
  navigateTo("screen-food");
}
window.returnToFoodFromRooms = returnToFoodFromRooms;

// افزودن سریع اتاق به اقامت مستقیماً از داخل صفحه غذا
function quickAddRoomToStay(roomId) {
  try { triggerHaptic('medium'); } catch (_) {}
  const room = ROOMS.find(r => r.id === roomId);
  if (!room) return;

  if (!state.reservation.selectedRoomIds) {
    state.reservation.selectedRoomIds = [];
  }
  if (!state.reservation.roomGuests) {
    state.reservation.roomGuests = {};
  }
  if (!state.reservation.roomCounts) {
    state.reservation.roomCounts = {};
  }

  if (!state.reservation.selectedRoomIds.includes(roomId)) {
    state.reservation.selectedRoomIds.push(roomId);
    state.reservation.roomGuests[roomId] = room.baseCapacity || 2;
    state.reservation.roomCounts[roomId] = 1;
    showToast(`اتاق ${room.name} (${formatPersianNumber(state.reservation.roomGuests[roomId])} نفر) به اقامت افزوده شد.`);
  } else {
    showToast(`اتاق ${room.name} از قبل در لیست انتخاب‌های شماست.`);
  }

  state.selectedRoomId = roomId;
  if (!state.reservation.checkInDate) {
    state.reservation.checkInDate = state.foodOrder.date || getTomorrowFormattedDate();
  }
  syncFoodToReservationInputs();
  renderFoodSection();
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  updateFoodOrderSummary();
  updateFloatingBookingBar();
  renderRoomsList();
}
window.quickAddRoomToStay = quickAddRoomToStay;

// تغییر تعداد نفرات یک اتاق از صفحه غذا
function changeRoomGuestsFromFood(roomId, delta) {
  changeRoomGuests(roomId, delta);
  renderFoodSection();
  updateFoodOrderSummary();
}
window.changeRoomGuestsFromFood = changeRoomGuestsFromFood;

// حذف یک اتاق مشخص از اقامت در صفحه غذا
function removeRoomFromFoodOrder(roomId) {
  removeRoomFromReservation(roomId);
  renderFoodSection();
  updateFoodOrderSummary();
}
window.removeRoomFromFoodOrder = removeRoomFromFoodOrder;

// تغییر تعداد شب‌های اقامت از صفحه غذا
function changeStayNightsFromFood(delta) {
  changeReservationNights(delta);
  renderFoodSection();
  updateFoodOrderSummary();
}
window.changeStayNightsFromFood = changeStayNightsFromFood;

// هدایت کاربر از فرم اقامت به منوی غذا
function navigateToFoodFromReservation() {
  try { triggerHaptic('light'); } catch (_) {}
  syncReservationToFoodInputs();
  navigateTo("screen-food", "screen-reservation");
}
window.navigateToFoodFromReservation = navigateToFoodFromReservation;

// هدایت کاربر از صفحه غذا به فرم رزرو اقامت (جهت افزودن یا تغییر اتاق)
function navigateToReservationFromFood() {
  try { triggerHaptic('light'); } catch (_) {}
  syncFoodToReservationInputs();
  state.reservationSourceScreen = "screen-food";
  state.foodReturnToReservation = true;
  navigateTo("screen-reservation", "screen-food");
}
window.navigateToReservationFromFood = navigateToReservationFromFood;

// حذف اقامت از صفحه غذا (تبدیل به سفارش فقط غذا)
function clearStayFromFoodOrder() {
  try { triggerHaptic('light'); } catch (_) {}
  state.reservation.selectedRoomIds = [];
  state.selectedRoomId = null;
  state.foodReturnToReservation = false;
  renderFoodSection();
  updateFoodOrderSummary();
  updateReservationCalculations();
  showToast("رزرو اقامت از این سفارش حذف شد (سفارش فقط غذا).");
}
window.clearStayFromFoodOrder = clearStayFromFoodOrder;

// ذخیره انتخاب غذا و بازگشت به فرم اقامت
function saveFoodAndReturnToReservation() {
  try { triggerHaptic('medium'); } catch (_) {}
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length > 1) {
    if (!checkGroupRuleViolation(() => executeSaveFoodAndReturnToReservation())) return;
  }
  executeSaveFoodAndReturnToReservation();
}
window.saveFoodAndReturnToReservation = saveFoodAndReturnToReservation;

function executeSaveFoodAndReturnToReservation() {
  syncFoodToReservationInputs();
  updateReservationCalculations();
  navigateTo("screen-reservation");
  showToast("غذاهای انتخابی با موفقیت به سفارش اقامت اضافه شدند.");
}

// حذف سفارش غذا از اقامت
function clearFoodFromReservation() {
  try { triggerHaptic('light'); } catch (_) {}
  state.foodOrder.selectedDishes = {};
  state.foodOrder.scheduledMeals = [];
  updateReservationCalculations();
  renderFoodSection();
  showToast("سفارش غذا از درخواست اقامت حذف شد.");
}
window.clearFoodFromReservation = clearFoodFromReservation;

// همگام‌سازی ورودی‌های فرم اقامت با فرم غذا
function syncReservationToFoodInputs() {
  syncFoodToReservationInputs();
}

// همگام‌سازی جامع نام، تلفن، تاریخ و اطلاعات بین صفحه غذا و اقامت
function syncFoodToReservationInputs() {
  const liveFoodName = document.getElementById("food-name")?.value.trim();
  const liveResName = document.getElementById("res-name")?.value.trim();
  const name = liveFoodName || liveResName || state.foodOrder.name || state.reservation.name || "";

  const liveFoodPhone = document.getElementById("food-phone")?.value.trim();
  const liveResPhone = document.getElementById("res-phone")?.value.trim();
  const phone = liveFoodPhone || liveResPhone || state.foodOrder.phone || state.reservation.phone || "";

  const foodDate = document.getElementById("food-date")?.value || state.foodOrder.date || state.reservation.checkInDate;
  const foodMeal = document.getElementById("food-meal")?.value || state.foodOrder.mealType;

  if (name) {
    state.foodOrder.name = name;
    state.reservation.name = name;
    const resNameInput = document.getElementById("res-name");
    if (resNameInput && resNameInput.value !== name) resNameInput.value = name;
    const foodNameInput = document.getElementById("food-name");
    if (foodNameInput && foodNameInput.value !== name) foodNameInput.value = name;
  }
  if (phone) {
    state.foodOrder.phone = phone;
    state.reservation.phone = phone;
    const resPhoneInput = document.getElementById("res-phone");
    if (resPhoneInput && resPhoneInput.value !== phone) resPhoneInput.value = phone;
    const foodPhoneInput = document.getElementById("food-phone");
    if (foodPhoneInput && foodPhoneInput.value !== phone) foodPhoneInput.value = phone;
  }
  const liveFoodNotes = document.getElementById("food-notes")?.value.trim();
  const liveResNotes = document.getElementById("res-notes")?.value.trim();
  const notes = liveFoodNotes || liveResNotes || state.foodOrder.notes || state.reservation.notes || "";
  if (notes) {
    state.foodOrder.notes = notes;
    state.reservation.notes = notes;
    const resNotesInput = document.getElementById("res-notes");
    if (resNotesInput && resNotesInput.value !== notes) resNotesInput.value = notes;
    const foodNotesInput = document.getElementById("food-notes");
    if (foodNotesInput && foodNotesInput.value !== notes) foodNotesInput.value = notes;
  }
  if (foodDate) {
    state.foodOrder.date = foodDate;
    if (!state.reservation.checkInDate) {
      state.reservation.checkInDate = foodDate;
    }
    try {
      state.foodOrder.dayOfWeek = getJalaliDetails(foodDate).weekday;
    } catch (e) {}
  }
  if (foodMeal && ['ناهار', 'شام'].includes(foodMeal)) {
    state.foodOrder.mealType = foodMeal;
  }
}

/**
 * تولید متن پیام یکپارچه نهایی
 * @param {'guest' | 'group'} target - در حالت group، شرایط تخفیف، متون تکمیلی و بخش غذای خالی طبق درخواست حذف می‌شود.
 */
function generateUnifiedOrderMessage(target = 'guest') {
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  // استخراج نام و شماره با اولویت فیلدهای زنده
  const liveFoodName = document.getElementById("food-name")?.value.trim();
  const liveResName = document.getElementById("res-name")?.value.trim();
  const rawName = liveFoodName || liveResName || state.foodOrder.name || state.reservation.name || "";
  const name = rawName || "مهمان گرامی";

  const liveFoodPhone = document.getElementById("food-phone")?.value.trim();
  const liveResPhone = document.getElementById("res-phone")?.value.trim();
  const phone = liveFoodPhone || liveResPhone || state.foodOrder.phone || state.reservation.phone || "";

  if (rawName) {
    state.foodOrder.name = rawName;
    state.reservation.name = rawName;
  }
  if (phone) {
    state.foodOrder.phone = phone;
    state.reservation.phone = phone;
  }

  // استخراج توضیحات و ملاحظات خاص مهمان
  const liveFoodNotes = document.getElementById("food-notes")?.value.trim();
  const liveResNotes = document.getElementById("res-notes")?.value.trim();
  const rawNotes = liveFoodNotes || liveResNotes || state.foodOrder.notes || state.reservation.notes || "";
  if (rawNotes) {
    state.foodOrder.notes = rawNotes;
    state.reservation.notes = rawNotes;
  }
  const notesLine = rawNotes ? `\n📝 توضیحات و ملاحظات (اقامت و خوراک):\n${rawNotes}` : "";
  const notesLineInline = rawNotes ? `\n\n📝 توضیحات و ملاحظات (اقامت و خوراک):\n${rawNotes}` : "";

  const checkIn = state.reservation.checkInDate;
  const checkOut = state.reservation.checkOutDate || addDaysToDateString(checkIn, state.reservation.nights);
  const nights = state.reservation.nights;
  const guests = state.reservation.guests;

  // زمان ثبت درخواست به تقویم شمسی
  const nowJalaliString = getJalaliNowString();

  // تاریخ‌های ورود و خروج و روزهای هفته به شمسی
  const checkInJalali = getJalaliDetails(checkIn);
  const checkOutJalali = getJalaliDetails(checkOut);
  const stayDaysText = `${checkInJalali.weekday} تا ${checkOutJalali.weekday}`;

  // بررسی وجود آیدی تلگرام مهمان (فقط آیدی بدون آدرس کامل تلگرام طبق درخواست)
  const tgUser = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || state.telegramUser;
  const telegramUsername = tgUser?.username || "";
  const telegramLine = telegramUsername ? `\n💬 آیدی تلگرام مهمان: @${telegramUsername}` : "";

  let roomsDetailText = "";

  if (selectedRooms.length > 0) {
    roomsDetailText = selectedRooms.map(r => {
      const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
      const costInfo = calculateRoomNightCost(r, g);
      let guestText = `${formatPersianNumber(g)} نفر`;
      if (costInfo.extraGuests > 0) {
        guestText += ` (${formatPersianNumber(costInfo.baseGuests)} نفر پایه + ${formatPersianNumber(costInfo.extraGuests)} نفر اضافه با ۱۰٪ تخفیف: هر نفر ${formatToman(costInfo.extraPrice)})`;
      } else {
        guestText += ` (${formatToman(costInfo.basePrice)} هر نفر/شب پایه با صبحانه)`;
      }
      return `• اتاق ${r.name}: ${guestText} • هزینه هر شب: ${formatToman(costInfo.cost)}`;
    }).join("\n");
  }

  // محاسبه دقیق تخفیف اقامت
  const discountData = calculateStayDiscount(checkIn, nights, guests);
  const roomTotal = discountData.finalRoomTotal;

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

  // مرتب‌سازی تقویمی و زمانی وعده‌ها: به ترتیب تاریخ و سپس صبحانه، ناهار، شام
  const sortedScheduled = sortScheduledMealsChronologically(scheduled);

  let foodTotal = 0;
  let foodSectionText = "";

  if (sortedScheduled.length > 0) {
    const mealsTextBlocks = sortedScheduled.map((m, idx) => {
      foodTotal += m.subtotal;
      const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
      const mJalali = getJalaliDetails(m.date);
      const dishesLines = m.dishes.map(d => `    ▫️ ${d.name} × ${formatPersianNumber(d.quantity)} پرس (${formatToman(d.total)})`).join("\n");
      return `  ${icon} وعده ${formatPersianNumber(idx + 1)}: ${m.mealType} (${mJalali.weekday} ${mJalali.dateOnlyString})
${dishesLines}
    جمع وعده: ${formatToman(m.subtotal)}`;
    }).join("\n\n");

    foodSectionText = `🍽️ برنامه وعده‌های غذایی انتخابی (${formatPersianNumber(sortedScheduled.length)} وعده):
${mealsTextBlocks}
• برآورد کل خوراک و پذیرایی: ${formatToman(foodTotal)}`;
  } else {
    foodSectionText = `🍽️ سفارش خوراک:
• بدون سفارش غذای مازاد (اقامت همراه با صبحانه سنتی روستایی)`;
  }

  const grandTotal = roomTotal + foodTotal;

  // ۱. در صورتی که کاربر اتاق انتخاب کرده باشد (سفارش یکپارچه اقامت + غذا)
  if (selectedRooms.length > 0) {
    // ۱-الف: فرمت مختصر و استاندارد گروه رزرو تلگرام خانه برزک (بدون شرایط تخفیف، بدون جزئیات اضافی قیمت هر اتاق، و حذف غذا در صورت عدم سفارش)
    if (target === 'group') {
      const roomsSummaryGroup = selectedRooms.map(r => {
        const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
        return `  ▫️ اتاق ${r.name} (${formatPersianNumber(g)} نفر)`;
      }).join("\n");

      let stayPriceGroup = `• برآورد اقامت: ${formatToman(discountData.totalBaseRoom)}`;
      if (discountData.hasDiscount) {
        stayPriceGroup = `• برآورد اقامت: ${formatToman(discountData.finalRoomTotal)} (با کسر ${formatToman(discountData.totalDiscount)} تخفیف)`;
      }

      // در گروه تلگرام: اگر غذا سفارش داده نشده باشد، اصلاً هیچ بخشی از غذا نشان داده نمی‌شود
      let foodSectionGroup = "";
      if (sortedScheduled.length > 0) {
        const mealsTextBlocksGroup = sortedScheduled.map((m, idx) => {
          const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
          const mJalali = getJalaliDetails(m.date);
          const dishesLines = m.dishes.map(d => `    ▫️ ${d.name} × ${formatPersianNumber(d.quantity)} پرس`).join("\n");
          return `  ${icon} وعده ${formatPersianNumber(idx + 1)}: ${m.mealType} (${mJalali.weekday} ${mJalali.dateOnlyString})
${dishesLines}
    جمع وعده: ${formatToman(m.subtotal)}`;
        }).join("\n\n");

        foodSectionGroup = `

🍽️ وعده‌های غذایی انتخابی (${formatPersianNumber(sortedScheduled.length)} وعده):
${mealsTextBlocksGroup}
• برآورد خوراک: ${formatToman(foodTotal)}`;
      }

      return `🌿 درخواست رزرو در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}${telegramLine}
⏰ زمان ثبت: ${nowJalaliString}

🏡 مشخصات اقامت:
• اتاق‌های انتخابی:
${roomsSummaryGroup}
• تاریخ و روز ورود: ${checkInJalali.fullString}
• تاریخ و روز خروج: ${checkOutJalali.fullString}
• مدت اقامت: ${formatPersianNumber(nights)} شب (${stayDaysText})
• تعداد کل نفرات: ${formatPersianNumber(guests)} نفر (همراه با صبحانه)
${stayPriceGroup}${foodSectionGroup}${notesLineInline}

💰 جمع کل برآورد: ${formatToman(grandTotal)}
#درخواست_رزرو`;
    }

    // ۱-ب: فرمت کامل پیش‌نمایش برای مهمان (شامل توضیحات شرایط تخفیف و یادداشت‌های بررسی میزبان)
    let stayPriceLines = `• برآورد اقامت: ${formatToman(discountData.totalBaseRoom)}`;
    if (discountData.hasDiscount) {
      stayPriceLines = `• مبلغ پایه اقامت: ${formatToman(discountData.totalBaseRoom)}
• تخفیف اقامت (وسط هفته / شب دوم): - ${formatToman(discountData.totalDiscount)}
• مبلغ خالص اقامت پس از تخفیف: ${formatToman(discountData.finalRoomTotal)}`;
    }

    const discountStatusNote = discountData.hasDiscount
      ? `✨ وضعیت تخفیف این رزرو: مشمول ${formatToman(discountData.totalDiscount)} تخفیف برآورد اولیه (اعمال نهایی توسط میزبان در پیش‌فاکتور انجام خواهد شد)`
      : `✨ وضعیت تخفیف این رزرو: تاریخ‌های انتخابی در پایان هفته یا ایام تعطیل است`;

    return `🌿 درخواست رزرو در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}${telegramLine}
⏰ زمان ثبت درخواست: ${nowJalaliString}

🏡 مشخصات اقامت:
${roomsDetailText}
• تاریخ و روز ورود: ${checkInJalali.fullString}
• تاریخ و روز خروج: ${checkOutJalali.fullString}
• مدت اقامت: ${formatPersianNumber(nights)} شب (روزهای اقامت: ${stayDaysText})
• تعداد نفرات کل: ${formatPersianNumber(guests)} نفر (همراه با صبحانه سنتی روستایی)
${stayPriceLines}

🏷️ شرایط تخفیف اقامت:
برای روزهای وسط هفته و غیر تعطیل (از شنبه تا سه‌شنبه) ۱۰ درصد تخفیف، و برای اقامت بیش از یک شب ۱۰ درصد تخفیف در شب دوم در نظر گرفته می‌شود.
${discountStatusNote}

${foodSectionText}${notesLineInline}

💰 جمع کل برآورد نهایی: ${formatToman(grandTotal)}

🌱 این درخواست پس از بررسی میزبان تایید و نهایی می‌شود.
#درخواست_رزرو`;
  }

  // ۲. در صورتی که سفارش صرفاً برای غذا و صبحانه باشد (مستقل از اقامت)
  if (target === 'group') {
    return `🍽️ درخواست سفارش غذای محلی و پذیرایی در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}${telegramLine}
⏰ زمان ثبت: ${nowJalaliString}

${foodSectionText}${notesLineInline}

💰 برآورد کل سفارش: ${formatToman(foodTotal)}
#سفارش_غذا`;
  }

  return `🍽️ درخواست سفارش غذای محلی و پذیرایی در خانه برزک

👤 مهمان: ${name}
📞 تماس: ${phone}${telegramLine}
⏰ زمان ثبت درخواست: ${nowJalaliString}

${foodSectionText}${notesLineInline}

💰 برآورد کل سفارش: ${formatToman(foodTotal)}

✨ تذکر: امکان پذیرایی در حیاط مصفای خانه برزک برای مهمانان آزاد فراهم می‌باشد (هزینه خدمات نفری ۲۰۰,۰۰۰ تومان).
🌱 سفارش شما پس از بررسی میزبان تایید و آماده‌سازی خواهد شد.
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

  if (!state.reservation.checkInDate) {
    showToast("لطفاً ابتدا تاریخ ورود را از تقویم انتخاب فرمایید.");
    openShamsiDatePicker('reservation');
    return;
  }

  const nameInputEl = document.getElementById("res-name");
  const name = (nameInputEl && nameInputEl.value.trim()) || state.reservation.name;

  if (!name) {
    triggerHaptic('warning');
    showToast("لطفاً نام و نام خانوادگی خود را وارد کنید.");
    document.getElementById("res-name")?.focus();
    return;
  }
  state.reservation.name = name;

  const phoneInputEl = document.getElementById("res-phone");
  const rawPhone = (phoneInputEl && phoneInputEl.value) ? phoneInputEl.value : state.reservation.phone;
  const phoneValidation = validateIranianMobile(rawPhone);

  if (!phoneValidation.valid) {
    triggerHaptic('warning');
    showToast(phoneValidation.error);
    document.getElementById("res-phone")?.focus();
    return;
  }

  const cleanPhone = phoneValidation.phone;
  state.reservation.phone = cleanPhone;
  if (phoneInputEl) phoneInputEl.value = cleanPhone;

  // در صورت انتخاب ۲ نوع خوراک همراه با اقامت، بررسی قانون حداقل ۱۰ پرس
  const selectedDishIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedDishIds.length > 1) {
    if (!checkGroupRuleViolation(() => submitReservationForm())) return;
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

/**
 * تولید ساختار HTML کارت یکپارچه اقامت برای صفحه غذا (مشابه بخش اقامت با امکان انتخاب و ویرایش اتاق)
 */
function renderUnifiedStayCardHTML(selectedRooms) {
  const isSelected = selectedRooms.length > 0;
  const checkInVal = state.reservation.checkInDate || state.foodOrder.date || getTomorrowFormattedDate();
  const inJalali = getJalaliDetails(checkInVal);
  const nightsVal = state.reservation.nights || 1;

  // اتاق‌هایی که هنوز انتخاب نشده‌اند جهت افزودن سریع
  const unselectedRooms = ROOMS.filter(r => !selectedRooms.some(sr => sr.id === r.id));

  let html = `
    <div class="unified-stay-header">
      <span class="unified-stay-title">
        <span>🏡</span>
        <span>${isSelected ? `اقامت در خانه برزک (${formatPersianNumber(selectedRooms.length)} اتاق انتخاب شده)` : 'رزرو اقامت و اتاق در خانه برزک (اختیاری)'}</span>
      </span>
      <span class="badge-unified" style="${isSelected ? 'background: #e6f4ea; color: #137333; font-weight: 800;' : 'background: var(--brand-surface-subtle); color: var(--brand-text-muted);'}">
        ${isSelected ? `دارای اقامت (${formatPersianNumber(selectedRooms.length)} اتاق)` : 'بدون اقامت (فقط غذا)'}
      </span>
    </div>
  `;

  if (!isSelected) {
    html += `
      <p style="font-size: 12.5px; color: var(--brand-text-muted); line-height: 1.6; margin-bottom: 12px;">
        اگر مایلید علاوه بر غذا، در اتاق‌های سنتی خانه برزک اقامت داشته باشید، می‌توانید مستقیماً از همین‌جا یا با ورود به صفحه رزرو اقامت، اتاق‌های مد نظر خود را انتخاب و ویرایش فرمایید.
      </p>

      <div style="display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;">
        <button type="button" class="btn btn-mustard" style="flex: 1; min-width: 180px; font-size: 13px; font-weight: 800; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;" onclick="openReservationFromFood()">
          <span>📝 رفتن به صفحه انتخاب اقامت</span>
          <span>صفحه رزرو ←</span>
        </button>
        <button type="button" class="btn btn-outline" style="font-size: 12.5px; font-weight: 700; padding: 10px 14px;" onclick="openRoomsFromFood()">
          🏠 عکس‌ها و مشخصات ۷ اتاق
        </button>
      </div>

      <div style="background: #ffffff; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--brand-border); box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="font-size: 13px; font-weight: 800; color: var(--brand-green); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
          <span>⚡ انتخاب مستقیم و سریع اتاق‌های سنتی:</span>
          <span style="font-size: 11px; font-weight: normal; color: var(--brand-text-muted);">کلیک جهت انتخاب</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${ROOMS.map(r => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; background: #faf8f5; border: 1px solid #eee8dd; border-radius: 8px;">
              <div style="text-align: right;">
                <div style="font-weight: 800; font-size: 13.5px; color: var(--brand-green);">🏠 اتاق ${r.name}</div>
                <div style="font-size: 11px; color: var(--brand-text-muted); margin-top: 2px;">👥 ${r.shortCapacity || r.capacityDisplay} • ${r.beds}</div>
                <div style="font-size: 11.5px; font-weight: 700; color: #b45309; margin-top: 2px;">${formatToman(r.price)} <small style="font-size: 10px; font-weight: normal;">هر نفر/شب</small></div>
              </div>
              <button type="button" class="btn btn-mustard" onclick="quickAddRoomToStay('${r.id}')" style="font-size: 12px; font-weight: 800; padding: 6px 12px; border-radius: 6px; white-space: nowrap;">
                ➕ انتخاب این اتاق
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    // اقامت انتخاب شده است - نمایش و ویرایش کامل مشابه فرم اقامت
    const totalGuests = selectedRooms.reduce((sum, r) => {
      return sum + ((state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2);
    }, 0);
    state.reservation.guests = totalGuests;

    const discountData = calculateStayDiscount(checkInVal, nightsVal, totalGuests);

    html += `
      <!-- نوار ناوبری سریع به صفحه اقامت -->
      <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
        <button type="button" class="btn btn-mustard" style="flex: 1; min-width: 170px; font-size: 12.5px; font-weight: 800; padding: 9px 12px; display: flex; justify-content: space-between; align-items: center;" onclick="openReservationFromFood()">
          <span>📝 ویرایش در صفحه رزرو اقامت</span>
          <span>فرم کامل ←</span>
        </button>
        <button type="button" class="btn btn-outline" style="font-size: 12px; font-weight: 700; padding: 9px 12px;" onclick="openRoomsFromFood()">
          🏠 افزودن اتاق دیگر
        </button>
        <button type="button" class="btn btn-outline" style="font-size: 12px; padding: 9px 12px; color: #b91c1c; border-color: #fecaca; background: #fff5f5;" onclick="clearStayFromFoodOrder()">
          🗑️ فقط غذا (حذف اقامت)
        </button>
      </div>

      <!-- لیست اتاق‌های انتخابی با کنترل‌های افزایش/کاهش نفرات و حذف مشابه بخش اقامت -->
      <div style="margin-bottom: 12px;">
        <div style="font-size: 12.5px; font-weight: 800; color: var(--brand-green); margin-bottom: 8px;">
          اتاق‌های انتخاب‌شده و کنترل تعداد نفرات:
        </div>
        ${selectedRooms.map(room => {
          const guests = (state.reservation.roomGuests && state.reservation.roomGuests[room.id]) || room.baseCapacity || 2;
          const costInfo = calculateRoomNightCost(room, guests);
          const isAtMax = guests >= costInfo.maxCap;
          const isAtMin = guests <= 1;
          const isExtra = costInfo.extraGuests > 0;

          return `
            <div class="selected-room-chip" style="display: flex; flex-direction: column; gap: 8px; padding: 12px; background: #ffffff; border: 1px solid var(--brand-border); border-radius: var(--radius-md); margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-weight: 800; font-size: 14px; color: var(--brand-green);">🏠 اتاق ${room.name}</span>
                  <span style="font-size: 11px; color: var(--brand-text-muted); margin-right: 6px;">(ظرفیت پایه: ${formatPersianNumber(costInfo.baseCap)} نفر${costInfo.extraCap > 0 ? ` + تا ${formatPersianNumber(costInfo.extraCap)} نفر اضافه` : ''})</span>
                </div>
                <button type="button" class="selected-room-remove-btn" onclick="removeRoomFromFoodOrder('${room.id}')" title="حذف این اتاق از سفارش" style="width: 26px; height: 26px; border-radius: 50%; border: 1px solid #fecaca; background: #fff5f5; color: #b91c1c; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">✕</button>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; background: #fbf9f4; border: 1px solid #edd9b8; padding: 8px 12px; border-radius: 8px;">
                <div>
                  <span style="font-size: 12.5px; font-weight: 800; color: var(--brand-green);">تعداد نفرات این اتاق:</span>
                  <span style="font-size: 10.5px; color: var(--brand-text-muted); display: block;">(حداکثر ${formatPersianNumber(costInfo.maxCap)} نفر)</span>
                </div>
                <div class="room-booking-counter" style="display: inline-flex; align-items: center; gap: 6px;">
                  <button type="button" class="room-counter-btn" onclick="changeRoomGuestsFromFood('${room.id}', -1)" title="کاهش نفرات" ${isAtMin ? 'disabled style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e5e5e5; background: #f3f3f3; color: #bbb; font-weight: bold; font-size: 15px; cursor: not-allowed; display: flex; align-items: center; justify-content: center;"' : 'style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #ccc; background: #fff; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;"'}>−</button>
                  <span style="font-weight: 800; font-size: 14.5px; color: var(--brand-green); min-width: 46px; text-align: center;">${formatPersianNumber(guests)} نفر</span>
                  <button type="button" class="room-counter-btn" onclick="changeRoomGuestsFromFood('${room.id}', 1)" title="افزایش نفرات" ${isAtMax ? 'disabled style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #e5e5e5; background: #f3f3f3; color: #bbb; font-weight: bold; font-size: 15px; cursor: not-allowed; display: flex; align-items: center; justify-content: center;"' : 'style="width: 28px; height: 28px; border-radius: 6px; border: 1px solid #ccc; background: #fff; font-weight: bold; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;"'}>+</button>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; padding: 2px 4px 0 4px;">
                <div>
                  ${isExtra 
                    ? `<span style="color: #276749; font-weight: 700; background: #edf7ee; padding: 2px 7px; border-radius: 5px; border: 1px solid #c9e8cd;">${formatPersianNumber(costInfo.baseGuests)} نفر پایه + ${formatPersianNumber(costInfo.extraGuests)} نفر اضافه (۱۰٪ تخفیف)</span>`
                    : `<span style="color: var(--brand-text-muted);">${formatPersianNumber(costInfo.baseGuests)} نفر (ظرفیت پایه با صبحانه)</span>`
                  }
                </div>
                <div style="font-weight: 800; color: var(--brand-green);">
                  ${formatToman(costInfo.cost)} <small style="font-size: 10.5px; font-weight: normal; color: var(--brand-text-muted);">/ شب</small>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- کنترل‌های تاریخ ورود و مدت اقامت -->
      <div style="background: #ffffff; border: 1px solid var(--brand-border); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center;">
          <div>
            <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--brand-green); margin-bottom: 4px;">📅 تاریخ ورود:</label>
            <div onclick="openShamsiDatePicker('food-stay')" style="cursor: pointer; background: #faf8f5; padding: 7px 10px; border-radius: 6px; border: 1px solid var(--brand-border); font-size: 12px; font-weight: 700; color: var(--brand-green); display: flex; justify-content: space-between; align-items: center;" title="جهت تغییر تاریخ با تقویم شمسی کلیک کنید">
              <span>${inJalali.dateOnlyString}</span>
              <span style="font-size: 10px; color: var(--brand-mustard-dark);">🗓️ ▾</span>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 11.5px; font-weight: 700; color: var(--brand-green); margin-bottom: 4px;">🌙 مدت اقامت:</label>
            <div class="stepper" style="margin: 0; width: 100%; height: 34px; background: #faf8f5; padding: 2px 4px;">
              <button type="button" class="stepper-btn" onclick="changeStayNightsFromFood(-1)" style="width: 26px; height: 26px; font-size: 14px;">-</button>
              <span class="stepper-val" style="min-width: 40px; font-size: 12px; font-weight: 800;">${formatPersianNumber(nightsVal)} شب</span>
              <button type="button" class="stepper-btn" onclick="changeStayNightsFromFood(1)" style="width: 26px; height: 26px; font-size: 14px;">+</button>
            </div>
          </div>
        </div>

        ${discountData.hasDiscount ? `
          <div style="margin-top: 8px; background: #eef7f2; border: 1px solid #c7e6d5; border-radius: 6px; padding: 5px 8px; font-size: 11.5px; font-weight: 700; color: var(--brand-green); display: flex; justify-content: space-between;">
            <span>🏷️ تخفیف اقامت اعمال‌شده:</span>
            <span>${formatToman(discountData.totalDiscount)} تخفیف</span>
          </div>
        ` : ''}

        <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; font-weight: 800; color: var(--brand-green); border-top: 1px dashed var(--brand-border); padding-top: 6px;">
          <span>برآورد هزینه کل اقامت (${formatPersianNumber(nightsVal)} شب - ${formatPersianNumber(totalGuests)} نفر):</span>
          <span>${formatToman(discountData.finalRoomTotal)}</span>
        </div>
      </div>

      ${unselectedRooms.length > 0 ? `
        <div style="margin-top: 10px; background: #faf8f5; border: 1px dashed var(--brand-border); border-radius: 8px; padding: 10px 12px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--brand-green); margin-bottom: 6px;">⚡ افزودن سریع اتاق‌های دیگر به همین رزرو:</div>
          <div class="room-quick-chips-row">
            ${unselectedRooms.map(r => `
              <button type="button" class="room-quick-chip" onclick="quickAddRoomToStay('${r.id}')" title="افزودن اتاق ${r.name}">
                <span>+</span>
                <span>اتاق ${r.name}</span>
                <small style="opacity: 0.75;">(${r.shortCapacity || r.capacityDisplay})</small>
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }

  return html;
}

function renderFoodSection() {
  const banner = document.getElementById("food-linked-stay-banner");
  const bannerText = document.getElementById("food-linked-stay-text");
  const saveReturnBtn = document.getElementById("btn-save-food-return");
  const submitFoodBtn = document.getElementById("btn-submit-food-order");
  
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  // بنر و دکمه بازگشت بر اساس وجود اقامت در سفارش
  if (selectedRooms.length > 0) {
    if (banner && bannerText) {
      banner.style.display = "flex";
      const inJalali = getJalaliDetails(state.reservation.checkInDate || getTomorrowFormattedDate());
      const roomNames = selectedRooms.map(r => r.name).join("، ");
      bannerText.textContent = `🏡 در حال انتخاب غذای محلی همراه با اقامت در «اتاق ${roomNames}» (ورود: ${inJalali.fullString})`;
    }
    if (saveReturnBtn) {
      saveReturnBtn.style.display = "block";
      saveReturnBtn.innerHTML = "💾 ذخیره غذاها و بازگشت به رزرو اقامت";
    }
  } else {
    if (banner) {
      banner.style.display = "none";
    }
    if (saveReturnBtn) {
      saveReturnBtn.style.display = "none";
    }
  }

  // به‌روزرسانی کارت‌های تعاملی اقامت در بالا و پایین صفحه غذا (امکان انتخاب و ویرایش اتاق مستقیماً از صفحه غذا)
  const topStayCard = document.getElementById("food-stay-top-card");
  const bottomStayCard = document.getElementById("unified-stay-card");
  const stayHTML = renderUnifiedStayCardHTML(selectedRooms);

  if (topStayCard) {
    topStayCard.innerHTML = stayHTML;
    if (selectedRooms.length > 0) {
      topStayCard.classList.add("has-stay");
    } else {
      topStayCard.classList.remove("has-stay");
    }
  }

  if (bottomStayCard) {
    bottomStayCard.innerHTML = stayHTML;
    if (selectedRooms.length > 0) {
      bottomStayCard.classList.add("has-stay");
    } else {
      bottomStayCard.classList.remove("has-stay");
    }
  }

  if (submitFoodBtn) {
    if (selectedRooms.length > 0) {
      submitFoodBtn.textContent = "ارسال درخواست یکپارچه اقامت و غذا ←";
    } else {
      submitFoodBtn.textContent = "ارسال درخواست سفارش غذا ←";
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
    const foodDateDisplay = document.getElementById("food-date-shamsi-display");
    if (foodDateDisplay && foodDateInput.value) {
      const jDetails = getJalaliDetails(foodDateInput.value);
      foodDateDisplay.textContent = `📅 ${jDetails.fullString}`;
      state.foodOrder.dayOfWeek = jDetails.weekday;
    }
  }

  // تضمین اینکه نوع وعده معتبر است (فقط ناهار و شام)
  if (!['ناهار', 'شام'].includes(state.foodOrder.mealType)) {
    state.foodOrder.mealType = 'ناهار';
  }
  if (foodMealSelect) {
    foodMealSelect.value = state.foodOrder.mealType;
  }

  updateMealAvailabilityForDate(state.foodOrder.date);
  renderFoodList();
  renderScheduledMeals();
  updateFoodOrderSummary();
}

/**
 * بررسی وضعیت وعده‌های غذایی در تاریخ انتخابی:
 * قانون کاربردی: برای هر روز، ناهار و شام هر کدام حداکثر یک‌بار قابل انتخاب هستند.
 */
function updateMealAvailabilityForDate(dateVal) {
  const currentDate = dateVal || state.foodOrder.date || (state.reservation && state.reservation.checkInDate) || getTodayFormattedDate();
  state.foodOrder.date = currentDate;

  let jDetails = { fullString: "", weekday: "", dateOnlyString: "" };
  try {
    jDetails = getJalaliDetails(currentDate);
    state.foodOrder.dayOfWeek = jDetails.weekday;
  } catch (e) {}

  const foodDateDisplay = document.getElementById("food-date-shamsi-display");
  if (foodDateDisplay && jDetails.fullString) {
    foodDateDisplay.textContent = `📅 ${jDetails.fullString}`;
  }

  const scheduled = state.foodOrder.scheduledMeals || [];
  const scheduledForDate = scheduled.filter(m => m.date === currentDate);
  const hasLunch = scheduledForDate.some(m => m.mealType === 'ناهار');
  const hasDinner = scheduledForDate.some(m => m.mealType === 'شام');

  const foodMealSelect = document.getElementById("food-meal");
  const mealStatusHint = document.getElementById("food-meal-status-hint");
  const currentMealBadge = document.getElementById("current-meal-badge");
  const addMealBtn = document.getElementById("btn-add-meal-to-schedule");

  if (foodMealSelect) {
    foodMealSelect.innerHTML = `
      <option value="ناهار" ${hasLunch ? 'disabled' : ''}>🍲 ناهار ${hasLunch ? '(قبلاً ثبت شده)' : ''}</option>
      <option value="شام" ${hasDinner ? 'disabled' : ''}>🌙 شام ${hasDinner ? '(قبلاً ثبت شده)' : ''}</option>
    `;

    // تنظیم هوشمند وعده انتخابی
    if (hasLunch && !hasDinner) {
      state.foodOrder.mealType = 'شام';
      foodMealSelect.value = 'شام';
    } else if (!hasLunch && hasDinner) {
      state.foodOrder.mealType = 'ناهار';
      foodMealSelect.value = 'ناهار';
    } else if (!hasLunch && !hasDinner) {
      if (!['ناهار', 'شام'].includes(state.foodOrder.mealType)) {
        state.foodOrder.mealType = 'ناهار';
      }
      foodMealSelect.value = state.foodOrder.mealType;
    }
  }

  // به‌روزرسانی پیام وضعیت و کنترل دکمه افزودن
  if (hasLunch && hasDinner) {
    if (mealStatusHint) {
      mealStatusHint.style.color = "#c2410c";
      mealStatusHint.style.background = "#fff7ed";
      mealStatusHint.style.padding = "7px 10px";
      mealStatusHint.style.borderRadius = "6px";
      mealStatusHint.style.border = "1px solid #fed7aa";
      mealStatusHint.innerHTML = `⚠️ هر دو وعده <b>ناهار</b> و <b>شام</b> برای ${jDetails.weekday} (${jDetails.dateOnlyString || currentDate}) در برنامه ثبت شده‌اند. برای انتخاب وعده جدید، لطفاً تاریخ دیگری را در تقویم بالا انتخاب فرمایید یا وعده ثبت‌شده را از لیست پایین حذف نمایید.`;
    }
    if (addMealBtn) {
      addMealBtn.disabled = true;
      addMealBtn.style.opacity = "0.5";
      addMealBtn.style.cursor = "not-allowed";
      addMealBtn.title = "برای این تاریخ هر دو وعده ناهار و شام قبلاً ثبت شده‌اند.";
    }
    if (currentMealBadge) {
      currentMealBadge.textContent = `تکمیل ناهار و شام (${jDetails.weekday})`;
      currentMealBadge.style.background = "#fff7ed";
      currentMealBadge.style.color = "#c2410c";
    }
  } else {
    if (addMealBtn) {
      addMealBtn.disabled = false;
      addMealBtn.style.opacity = "1";
      addMealBtn.style.cursor = "pointer";
      addMealBtn.title = "";
    }
    if (mealStatusHint) {
      mealStatusHint.style.background = "transparent";
      mealStatusHint.style.padding = "0";
      mealStatusHint.style.border = "none";
      if (hasLunch && !hasDinner) {
        mealStatusHint.style.color = "var(--brand-green)";
        mealStatusHint.innerHTML = `ℹ️ ناهار این روز قبلاً ثبت شده؛ اکنون در حال انتخاب وعده <b>شام (${jDetails.weekday})</b> هستید.`;
      } else if (!hasLunch && hasDinner) {
        mealStatusHint.style.color = "var(--brand-green)";
        mealStatusHint.innerHTML = `ℹ️ شام این روز قبلاً ثبت شده؛ اکنون در حال انتخاب وعده <b>ناهار (${jDetails.weekday})</b> هستید.`;
      } else {
        mealStatusHint.style.color = "var(--brand-text-muted)";
        mealStatusHint.innerHTML = `💡 برای هر روز، ناهار و شام هر کدام حداکثر یک‌بار قابل انتخاب هستند (${jDetails.weekday}).`;
      }
    }
    if (currentMealBadge) {
      const mealIcon = state.foodOrder.mealType === 'شام' ? '🌙' : '🍲';
      currentMealBadge.textContent = `${mealIcon} در حال انتخاب: ${state.foodOrder.mealType || 'ناهار'}`;
      currentMealBadge.style.background = "var(--brand-teal-subtle)";
      currentMealBadge.style.color = "var(--brand-teal-dark)";
    }
  }
}

// مدیریت تغییر نوع وعده جاری
function handleFoodMealTypeChange(meal) {
  triggerHaptic('light');
  state.foodOrder.mealType = meal;
  const currentMealBadge = document.getElementById("current-meal-badge");
  if (currentMealBadge) {
    const mealIcon = meal === 'شام' ? '🌙' : '🍲';
    currentMealBadge.textContent = `${mealIcon} در حال انتخاب: ${meal}`;
  }
  updateFoodOrderSummary();
}

// مدیریت تغییر تاریخ وعده جاری
function handleFoodDateChange(dateVal) {
  state.foodOrder.date = dateVal;
  try {
    const details = getJalaliDetails(dateVal);
    state.foodOrder.dayOfWeek = details.weekday;
    const foodDateDisplay = document.getElementById("food-date-shamsi-display");
    if (foodDateDisplay) {
      foodDateDisplay.textContent = `📅 ${details.fullString}`;
    }
  } catch (e) {}
  updateMealAvailabilityForDate(dateVal);
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
 * بررسی قانون انتخاب دو نوع خوراک:
 * برای انتخاب دو نوع خوراک، شرط این است که مجموع دو خوراک ۱۰ و بالاتر باشد وگرنه یک نوع خوراک باید حذف شود.
 */
function checkGroupRuleViolation(onSuccess) {
  const selectedDishIds = Object.keys(state.foodOrder.selectedDishes);
  
  // اگر ۱ نوع غذا یا کمتر انتخاب شده، هیچ محدودیتی وجود ندارد
  if (selectedDishIds.length <= 1) {
    return true;
  }

  // در صورت انتخاب ۲ نوع خوراک (یا بیشتر)، مجموع تعداد پرس‌ها بررسی می‌شود
  const portionsCount = selectedDishIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);

  // شرط قانون: مجموع دو خوراک ۱۰ و بالاتر باشد (>= 10)
  if (portionsCount >= 10) {
    return true;
  }

  // در صورتی که مجموع کمتر از ۱۰ باشد، مدال رفع مغایرت باز می‌شود تا کاربر یک نوع غذا را حذف کند یا به ۱۰ افزایش دهد
  triggerHaptic('warning');
  openGroupRuleModal({
    selectedDishIds: selectedDishIds,
    portionsCount: portionsCount,
    onSuccess: onSuccess
  });
  return false;
}

function openGroupRuleModal({ selectedDishIds, guestsCount, portionsCount, newDishIdToAdd, onSuccess }) {
  pendingGroupAction = onSuccess;
  
  const modal = document.getElementById("group-rule-modal");
  const statusBox = document.getElementById("group-rule-status-box");
  const actionButtons = document.getElementById("group-rule-action-buttons");
  if (!modal || !statusBox || !actionButtons) return;

  const dishId1 = selectedDishIds[0];
  const dishId2 = selectedDishIds[1] || newDishIdToAdd;
  const dish1 = FOOD_MENU.find(d => d.id === dishId1) || { name: "خوراک اول" };
  const dish2 = FOOD_MENU.find(d => d.id === dishId2) || { name: "خوراک دوم" };
  const qty1 = Number(state.foodOrder.selectedDishes[dishId1]) || 1;
  const qty2 = Number(state.foodOrder.selectedDishes[dishId2]) || (newDishIdToAdd ? 1 : 1);

  statusBox.innerHTML = `
    <div style="font-weight: 700; margin-bottom: 6px; color: #c2410c; font-size: 13px;">
      📊 وضعیت فعلی سفارش شما (${formatPersianNumber(portionsCount)} پرس / کمتر از ۱۰ پرس):
    </div>
    <div style="line-height: 1.8; font-size: 12.5px;">
      • خوراک انتخابی اول: <strong>«${dish1.name}»</strong> (${formatPersianNumber(qty1)} پرس)<br/>
      ${dishId2 ? `• خوراک انتخابی دوم: <strong>«${dish2.name}»</strong> (${formatPersianNumber(qty2)} پرس)<br/>` : ''}
      • مجموع پرس‌های ثبت‌شده: <strong>${formatPersianNumber(portionsCount)} پرس</strong>
    </div>
    <div style="margin-top: 8px; font-size: 12px; color: #7c2d12; border-top: 1px dashed #fdba74; padding-top: 6px; font-weight: 700;">
      💡 ضابطه پذیرایی: برای انتخاب دو نوع خوراک، مجموع دو خوراک باید حداقل ۱۰ پرس باشد، در غیر این صورت یکی از دو خوراک باید حذف شود.
    </div>
  `;

  if (newDishIdToAdd) {
    // کاربر روی خوراک دومی کلیک کرده در حالی که مجموع دو خوراک زیر ۱۰ است
    actionButtons.innerHTML = `
      <button type="button" class="btn btn-mustard" onclick="resolveGroupConflictIncreaseToAboveTen('${newDishIdToAdd}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
        <span>👥 افزایش مجموع به ۱۰ پرس (سفارش هر دو خوراک)</span>
        <span>۱۰ پرس ←</span>
      </button>

      <button type="button" class="btn btn-primary" onclick="resolveGroupConflictReplaceWithNew('${newDishIdToAdd}', '${dishId1}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
        <span>🍛 فقط «${dish2.name}» انتخاب شود (جایگزینی خوراک)</span>
        <span>۱ نوع خوراک ←</span>
      </button>

      <button type="button" class="btn btn-outline" onclick="closeGroupRuleModal('${newDishIdToAdd}')" style="font-size: 12.5px; padding: 8px 12px; color: var(--brand-text-muted);">
        ✕ انصراف (حفظ فقط «${dish1.name}»)
      </button>
    `;
  } else {
    // هنگام ثبت فرم یا ارسال نهایی
    actionButtons.innerHTML = `
      <button type="button" class="btn btn-primary" onclick="resolveGroupConflictKeepSingle('${dishId1}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
        <span>🍛 حذف خوراک دوم (فقط «${dish1.name}» به تعداد ${formatPersianNumber(qty1)} پرس بماند)</span>
        <span style="opacity: 0.9;">۱ نوع خوراک ←</span>
      </button>

      <button type="button" class="btn btn-primary" onclick="resolveGroupConflictKeepSingle('${dishId2}')" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
        <span>🥘 حذف خوراک اول (فقط «${dish2.name}» به تعداد ${formatPersianNumber(qty2)} پرس بماند)</span>
        <span style="opacity: 0.9;">۱ نوع خوراک ←</span>
      </button>

      <button type="button" class="btn btn-mustard" onclick="resolveGroupConflictIncreaseToAboveTen()" style="font-size: 13px; font-weight: 700; padding: 11px 14px; text-align: right; justify-content: space-between; display: flex;">
        <span>👥 افزایش مجموع به ۱۰ پرس (سفارش هر دو خوراک)</span>
        <span>۱۰ پرس ←</span>
      </button>

      <button type="button" class="btn btn-outline" onclick="closeGroupRuleModal()" style="font-size: 12.5px; padding: 8px 12px; color: var(--brand-text-muted);">
        ✏️ انصراف و تنظیم دستی در منو
      </button>
    `;
  }

  modal.classList.add("active");
}

function closeGroupRuleModal(uncheckDishId) {
  triggerHaptic('light');
  const modal = document.getElementById("group-rule-modal");
  if (modal) modal.classList.remove("active");
  if (uncheckDishId) {
    const cb = document.getElementById(`check-${uncheckDishId}`);
    if (cb) cb.checked = false;
  }
  pendingGroupAction = null;
}

function resolveGroupConflictReplaceWithNew(newDishId, oldDishId) {
  triggerHaptic('medium');
  const prevQty = state.foodOrder.selectedDishes[oldDishId] || 1;
  delete state.foodOrder.selectedDishes[oldDishId];
  state.foodOrder.selectedDishes[newDishId] = prevQty;
  state.foodOrder.isGroupTravel = false;

  const groupCheck = document.getElementById("food-group-travel-checkbox");
  if (groupCheck) groupCheck.checked = false;

  const newDish = FOOD_MENU.find(d => d.id === newDishId);
  const name = newDish ? newDish.name : "خوراک انتخابی";

  closeGroupRuleModal();
  renderFoodSection();
  updateReservationCalculations();
  showToast(`خوراک انتخابی به «${name}» تغییر یافت.`);
}

function resolveGroupConflictKeepSingle(dishIdToKeep) {
  triggerHaptic('medium');
  const currentKeys = Object.keys(state.foodOrder.selectedDishes);
  const dishToRemove = currentKeys.find(id => id !== dishIdToKeep);
  if (dishToRemove) {
    delete state.foodOrder.selectedDishes[dishToRemove];
  }
  
  const keptDish = FOOD_MENU.find(d => d.id === dishIdToKeep);
  const dishName = keptDish ? keptDish.name : "خوراک انتخابی";
  
  state.foodOrder.isGroupTravel = false;
  const groupCheck = document.getElementById("food-group-travel-checkbox");
  if (groupCheck) groupCheck.checked = false;

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

function resolveGroupConflictIncreaseToAboveTen(newDishIdToAdd) {
  triggerHaptic('medium');
  if (newDishIdToAdd) {
    // تنظیم هر دو خوراک به ۵ پرس تا مجموع بشود ۱۰ پرس
    state.foodOrder.selectedDishes[newDishIdToAdd] = 5;
    const currentKeys = Object.keys(state.foodOrder.selectedDishes).filter(k => k !== newDishIdToAdd);
    if (currentKeys.length > 0) {
      const k1 = currentKeys[0];
      state.foodOrder.selectedDishes[k1] = Math.max(5, state.foodOrder.selectedDishes[k1] || 5);
    }
  } else {
    const currentKeys = Object.keys(state.foodOrder.selectedDishes);
    if (currentKeys.length >= 2) {
      const q1 = Number(state.foodOrder.selectedDishes[currentKeys[0]]) || 1;
      const q2 = Number(state.foodOrder.selectedDishes[currentKeys[1]]) || 1;
      const currentSum = q1 + q2;
      if (currentSum < 10) {
        const needed = 10 - currentSum;
        const add1 = Math.ceil(needed / 2);
        const add2 = needed - add1;
        state.foodOrder.selectedDishes[currentKeys[0]] = q1 + add1;
        state.foodOrder.selectedDishes[currentKeys[1]] = q2 + add2;
      }
    } else if (currentKeys.length === 1) {
      state.foodOrder.selectedDishes[currentKeys[0]] = Math.max(10, Number(state.foodOrder.selectedDishes[currentKeys[0]]) || 10);
    }
  }

  state.foodOrder.isGroupTravel = true;
  const groupCheck = document.getElementById("food-group-travel-checkbox");
  if (groupCheck) groupCheck.checked = true;

  closeGroupRuleModal();
  renderFoodSection();
  updateReservationCalculations();
  showToast("سفارش به مجموع ۱۰ پرس (انتخاب هر دو خوراک) به‌روزرسانی شد.");

  if (typeof pendingGroupAction === "function") {
    const action = pendingGroupAction;
    pendingGroupAction = null;
    action();
  }
}

// ترتیب منطقی وعده‌ها در طول شبانه‌روز
const MEAL_TYPE_SORT_ORDER = {
  'صبحانه': 1,
  'ناهار': 2,
  'شام': 3
};

// مرتب‌سازی تقویمی و زمانی وعده‌ها: اول تاریخ و سپس صبحانه، ناهار و شام
function sortScheduledMealsChronologically(meals) {
  if (!meals || !Array.isArray(meals)) return [];
  return [...meals].sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    const orderA = MEAL_TYPE_SORT_ORDER[a.mealType] || 99;
    const orderB = MEAL_TYPE_SORT_ORDER[b.mealType] || 99;
    return orderA - orderB;
  });
}

// افزودن وعده جاری به لیست برنامه چند روزه/چند وعده‌ای
function addCurrentMealToSchedule() {
  triggerHaptic('medium');
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length === 0) {
    showToast("لطفاً ابتدا حداقل یک غذا از منوی بالا برای این وعده انتخاب کنید.");
    return;
  }

  // اعتبارسنجی قانون انتخاب ۲ نوع غذا: مجموع باید حداقل ۱۰ پرس باشد
  if (selectedIds.length > 1) {
    if (!checkGroupRuleViolation(() => executeAddCurrentMealToSchedule())) return;
  }
  executeAddCurrentMealToSchedule();
}

function executeAddCurrentMealToSchedule() {
  const selectedIds = Object.keys(state.foodOrder.selectedDishes);
  if (selectedIds.length === 0) return;

  const dateInput = document.getElementById("food-date");
  const mealSelect = document.getElementById("food-meal");

  const mealDate = (dateInput && dateInput.value) || state.foodOrder.date || getTodayFormattedDate();
  const jDetails = getJalaliDetails(mealDate);
  const mealDay = jDetails.weekday;
  const mealType = (mealSelect && mealSelect.value) || state.foodOrder.mealType || "ناهار";

  // بررسی قانون: برای هر روز ناهار و شام هر کدام یک‌بار
  const scheduled = state.foodOrder.scheduledMeals || [];
  const alreadyExists = scheduled.some(m => m.date === mealDate && m.mealType === mealType);
  if (alreadyExists) {
    triggerHaptic('warning');
    showToast(`برای تاریخ ${jDetails.weekday} (${jDetails.dateOnlyString || mealDate}) وعده ${mealType} قبلاً در برنامه ثبت شده است. برای هر روز ناهار و شام هر کدام فقط یک‌بار قابل انتخاب هستند.`);
    return;
  }

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
  state.foodOrder.scheduledMeals = sortScheduledMealsChronologically(state.foodOrder.scheduledMeals);

  // خالی کردن غذاهای وعده جاری جهت تنظیم وعده بعدی
  state.foodOrder.selectedDishes = {};

  // بررسی وضعیت وعده بعدی برای همین تاریخ یا روز بعد
  const sameDateMeals = state.foodOrder.scheduledMeals.filter(m => m.date === mealDate);
  const hasLunch = sameDateMeals.some(m => m.mealType === 'ناهار');
  const hasDinner = sameDateMeals.some(m => m.mealType === 'شام');

  if (hasLunch && !hasDinner) {
    // ناهار ثبت شد، نوبت شام همین روز است
    state.foodOrder.mealType = "شام";
    showToast(`وعده ناهار (${mealDay}) ثبت شد! اکنون می‌توانید وعده شام همین روز را انتخاب نمایید.`);
  } else {
    // هر دو وعده این روز ثبت شدند، انتقال هوشمند به ناهار روز بعد
    state.foodOrder.mealType = "ناهار";
    try {
      const nextDate = addDaysToDateString(mealDate, 1);
      state.foodOrder.date = nextDate;
      const dateInputEl = document.getElementById("food-date");
      if (dateInputEl) dateInputEl.value = nextDate;
      const nextJalali = getJalaliDetails(nextDate);
      showToast(`وعده ${mealType} (${mealDay}) ثبت شد! تاریخ به ${nextJalali.weekday} (${nextJalali.dateOnlyString}) منتقل شد.`);
    } catch (e) {
      showToast(`وعده ${mealType} (${mealDay}) با موفقیت در برنامه ثبت شد.`);
    }
  }

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

  const scheduled = sortScheduledMealsChronologically(state.foodOrder.scheduledMeals || []);
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

    const mJalali = getJalaliDetails(m.date);
    return `
      <div class="scheduled-meal-item">
        <div class="scheduled-meal-header">
          <span class="scheduled-meal-badge">
            ${icon} وعده ${formatPersianNumber(index + 1)}: ${m.mealType} (${mJalali.fullString})
          </span>
          <button type="button" class="scheduled-meal-delete-btn" onclick="removeScheduledMeal('${m.id}')" title="حذف این وعده">
            <span>🗑️</span>
            <span>حذف</span>
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

// قانون سفارش: انتخاب آزادانه تا ۲ نوع خوراک در یک وعده؛ اگر ۲ نوع خوراک انتخاب شد، مجموع انتخاب باید بالای ۱۰ پرس باشد (مثلاً خوراک۱ به تعداد ۶ پرس و خوراک۲ به تعداد ۴ پرس)
function toggleDishSelection(dishId) {
  triggerHaptic('light');
  const currentDishIds = Object.keys(state.foodOrder.selectedDishes);

  // اگر خوراک از قبل انتخاب شده، با کلیک مجدد حذف می‌شود
  if (state.foodOrder.selectedDishes[dishId]) {
    delete state.foodOrder.selectedDishes[dishId];
    renderFoodSection();
    updateReservationCalculations();
    return;
  }

  // حالت ۱: هنوز هیچ غذایی انتخاب نشده است
  if (currentDishIds.length === 0) {
    const guestsCount = (state.reservation && Number(state.reservation.guests)) || 0;
    state.foodOrder.selectedDishes[dishId] = Math.max(1, guestsCount || 1);
    renderFoodSection();
    updateReservationCalculations();
    return;
  }

  // حالت ۲: ۱ نوع غذا انتخاب شده و کاربر خوراک دوم را انتخاب می‌کند (از هر کجای منو کاملاً آزاد است)
  if (currentDishIds.length === 1) {
    state.foodOrder.selectedDishes[dishId] = 1;
    renderFoodSection();
    updateReservationCalculations();
    const existingDishId = currentDishIds[0];
    const existingQty = Number(state.foodOrder.selectedDishes[existingDishId]) || 1;
    const total = existingQty + 1;
    if (total < 10) {
      showToast(`خوراک دوم اضافه شد. مجموع دو خوراک باید حداقل ۱۰ پرس باشد (مثلاً ۶ و ۴ پرس).`);
    } else {
      showToast(`خوراک دوم اضافه شد (مجموع: ${formatPersianNumber(total)} پرس).`);
    }
    return;
  }

  // حالت ۳: بیش از ۲ نوع خوراک در یک وعده مجاز نیست
  triggerHaptic('warning');
  showToast("در هر وعده حداکثر ۲ نوع خوراک قابل انتخاب است. برای انتخاب خوراک دیگر، یکی از دو خوراک قبلی را بردارید.");
  const checkbox = document.getElementById(`check-${dishId}`);
  if (checkbox) checkbox.checked = false;
}

// تغییر وضعیت انتخاب چند نوع غذا
function toggleGroupTravel(isGroup) {
  triggerHaptic('light');
  state.foodOrder.isGroupTravel = !!isGroup;
  renderFoodSection();
  updateReservationCalculations();
}

function changeDishQty(dishId, delta) {
  triggerHaptic('light');
  if (!state.foodOrder.selectedDishes[dishId]) return;
  let q = (Number(state.foodOrder.selectedDishes[dishId]) || 1) + delta;
  if (q < 1) q = 1;
  if (q > 100) q = 100;

  // کاربر می‌تواند تعداد پرس‌های هر خوراک را کاملاً آزادانه کم یا زیاد کند
  state.foodOrder.selectedDishes[dishId] = q;
  renderFoodSection();
  updateReservationCalculations();
}

function autoCompletePortionsToTen() {
  triggerHaptic('medium');
  const currentKeys = Object.keys(state.foodOrder.selectedDishes);
  if (currentKeys.length === 0) return;
  const total = currentKeys.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);
  if (total < 10) {
    const needed = 10 - total;
    const targetKey = currentKeys[1] || currentKeys[0];
    state.foodOrder.selectedDishes[targetKey] = (Number(state.foodOrder.selectedDishes[targetKey]) || 0) + needed;
    renderFoodSection();
    updateReservationCalculations();
    showToast("مجموع تعداد پرس‌ها به ۱۰ پرس تکمیل شد.");
  }
}

function updateFoodOrderSummary() {
  const summaryBox = document.getElementById("food-order-summary");
  if (!summaryBox) return;

  const scheduled = sortScheduledMealsChronologically(state.foodOrder.scheduledMeals || []);
  const currentSelectedIds = Object.keys(state.foodOrder.selectedDishes);
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);

  if (scheduled.length === 0 && currentSelectedIds.length === 0 && selectedRooms.length === 0) {
    summaryBox.innerHTML = `
      <div style="font-size: 12.5px; color: var(--brand-text-muted); text-align: center;">
        هنوز غذا یا اقامتی انتخاب نشده است. از منوی بالا غذاهای محلی را انتخاب فرمایید و در صورت تمایل اقامت را نیز اضافه کنید.
      </div>
    `;
    return;
  }

  let grandTotal = 0;
  let summaryRows = "";

  // ۱. اقامت (در صورت انتخاب اتاق از صفحه غذا یا اقامت)
  if (selectedRooms.length > 0) {
    const checkInVal = state.reservation.checkInDate || state.foodOrder.date || getTomorrowFormattedDate();
    const nightsVal = state.reservation.nights || 1;
    const totalGuests = selectedRooms.reduce((sum, r) => {
      return sum + ((state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2);
    }, 0);
    const discountData = calculateStayDiscount(checkInVal, nightsVal, totalGuests);
    const roomCost = discountData.finalRoomTotal;
    grandTotal += roomCost;

    const inJalali = getJalaliDetails(checkInVal);
    const roomListStr = selectedRooms.map(r => {
      const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
      return `اتاق ${r.name} (${formatPersianNumber(g)} نفر)`;
    }).join("، ");

    summaryRows += `
      <div style="background: var(--brand-surface-subtle); border: 1px solid var(--brand-border); border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;">
        <div class="estimate-row" style="color: var(--brand-teal-dark); font-weight: 700; margin-bottom: 3px;">
          <span>🏡 اقامت خانه برزک (${formatPersianNumber(selectedRooms.length)} اتاق، ${formatPersianNumber(nightsVal)} شب):</span>
          <span>${formatToman(roomCost)}</span>
        </div>
        <div style="font-size: 11px; color: var(--brand-text-muted); line-height: 1.5;">
          • ${roomListStr} (مجموعاً ${formatPersianNumber(totalGuests)} نفر) | ورود: ${inJalali.dateOnlyString}
        </div>
        ${discountData.hasDiscount ? `
          <div style="font-size: 11px; color: var(--brand-green); font-weight: 600; margin-top: 3px;">
            ✓ شامل ${formatToman(discountData.totalDiscount)} تخفیف ویژه اقامت
          </div>
        ` : ''}
      </div>
    `;
  }

  // ۲. وعده‌های ثبت‌شده قبلی (به ترتیب تاریخ و زمان)
  if (scheduled.length > 0) {
    scheduled.forEach((m, idx) => {
      grandTotal += m.subtotal;
      const icon = m.mealType === 'صبحانه' ? '🍳' : m.mealType === 'شام' ? '🌙' : '🍲';
      const mJalali = getJalaliDetails(m.date);
      summaryRows += `
        <div class="estimate-row">
          <span>${icon} وعده ${formatPersianNumber(idx + 1)} (${m.mealType} ${mJalali.weekday} ${mJalali.dateOnlyString}):</span>
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

    // وضعیت انتخاب ۲ نوع خوراک در وعده جاری
    if (currentSelectedIds.length === 2) {
      const currentMealPortions = currentSelectedIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);
      if (currentMealPortions >= 10) {
        summaryRows += `
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 7px 10px; border-radius: 8px; font-size: 11.5px; margin: 6px 0;">
            ✓ انتخاب ۲ نوع خوراک (مجموع: <strong>${formatPersianNumber(currentMealPortions)} پرس</strong> • شرط حداقل ۱۰ پرس رعایت شده است)
          </div>
        `;
      } else {
        summaryRows += `
          <div style="background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; padding: 7px 10px; border-radius: 8px; font-size: 11.5px; margin: 6px 0;">
            ⚠️ انتخاب ۲ نوع خوراک: مجموع باید حداقل ۱۰ پرس باشد (مجموع فعلی: <strong>${formatPersianNumber(currentMealPortions)} پرس</strong> — نیاز به <strong>${formatPersianNumber(10 - currentMealPortions)} پرس</strong> دیگر). در غیر این صورت باید یک نوع خوراک حذف شود.
            <div style="margin-top: 6px; display: flex; gap: 5px; flex-wrap: wrap;">
              <button type="button" class="btn btn-mustard" style="font-size: 11px; padding: 3px 8px;" onclick="autoCompletePortionsToTen()">⚡ تکمیل به ۱۰ پرس</button>
              <button type="button" class="btn btn-outline" style="font-size: 11px; padding: 3px 8px;" onclick="resolveGroupConflictKeepSingle('${currentSelectedIds[0]}')">حذف خوراک دوم</button>
              <button type="button" class="btn btn-outline" style="font-size: 11px; padding: 3px 8px;" onclick="resolveGroupConflictKeepSingle('${currentSelectedIds[1]}')">حذف خوراک اول</button>
            </div>
          </div>
        `;
      }
    }
  }

  const totalLabel = selectedRooms.length > 0 ? "جمع کل برآورد اقامت و غذا:" : "جمع کل برآورد سفارش غذا:";

  summaryBox.innerHTML = `
    ${summaryRows}
    <div class="estimate-row estimate-total">
      <span>${totalLabel}</span>
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
    triggerHaptic('warning');
    showToast("لطفاً نام مهمان را وارد کنید.");
    document.getElementById("food-name")?.focus();
    return;
  }

  const foodPhoneInputEl = document.getElementById("food-phone");
  const rawFoodPhone = (foodPhoneInputEl && foodPhoneInputEl.value) ? foodPhoneInputEl.value : state.foodOrder.phone;
  const phoneValidation = validateIranianMobile(rawFoodPhone);

  if (!phoneValidation.valid) {
    triggerHaptic('warning');
    showToast(phoneValidation.error);
    document.getElementById("food-phone")?.focus();
    return;
  }

  const cleanPhone = phoneValidation.phone;
  state.foodOrder.phone = cleanPhone;
  if (foodPhoneInputEl) foodPhoneInputEl.value = cleanPhone;
  if (scheduled.length === 0 && currentSelectedIds.length === 0) {
    showToast("لطفاً حداقل یک غذا از منو یا برنامه وعده‌ها انتخاب کنید.");
    return;
  }

  // بررسی اینکه آیا اقلام جاری با وعده‌ای که قبلاً برای همین تاریخ ثبت شده تداخل دارد یا خیر
  if (currentSelectedIds.length > 0) {
    const activeDate = state.foodOrder.date || getTodayFormattedDate();
    const activeMeal = state.foodOrder.mealType || "ناهار";
    const duplicateInScheduled = scheduled.some(m => m.date === activeDate && m.mealType === activeMeal);
    if (duplicateInScheduled) {
      triggerHaptic('warning');
      const jDetails = getJalaliDetails(activeDate);
      showToast(`برای تاریخ ${jDetails.weekday} (${jDetails.dateOnlyString}) وعده ${activeMeal} قبلاً ثبت شده است (هر روز یک ناهار و یک شام).`);
      return;
    }
  }

  // اعتبارسنجی قانون انتخاب ۲ نوع غذا: مجموع باید حداقل ۱۰ پرس باشد
  if (currentSelectedIds.length > 1) {
    if (!checkGroupRuleViolation(() => executeSubmitFoodOrderForm())) return;
  }

  executeSubmitFoodOrderForm();
}

function executeSubmitFoodOrderForm() {
  updateReservationCalculations();
  const messageText = generateUnifiedOrderMessage();

  openMessagePreviewModal({
    title: "پیش‌نمایش درخواست شما",
    subtitle: "خلاصه درخواست شما آماده ارسال به اقامتگاه است:",
    messageText: messageText,
    actionType: "unified"
  });
}

// محاسبه تجمیعی کلیه مبالغ جاری (اقامت، تخفیف، خوراک)
function calculateCurrentTotals() {
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);
  const checkIn = state.reservation.checkInDate || getTomorrowFormattedDate();
  const nights = state.reservation.nights || 1;
  const guests = state.reservation.guests || 2;

  let avgPrice = 0;
  if (selectedRooms.length > 0) {
    const sumPrices = selectedRooms.reduce((sum, r) => sum + r.price, 0);
    avgPrice = Math.round(sumPrices / selectedRooms.length);
  }

  const discountData = calculateStayDiscount(checkIn, nights, guests, avgPrice);
  const roomTotal = selectedRooms.length > 0 ? discountData.finalRoomTotal : 0;

  let foodTotal = 0;
  const scheduled = state.foodOrder.scheduledMeals || [];
  scheduled.forEach(m => { foodTotal += m.subtotal; });
  const currentSelectedFoodIds = Object.keys(state.foodOrder.selectedDishes || {});
  currentSelectedFoodIds.forEach(id => {
    const dish = FOOD_MENU.find(d => d.id === id);
    const qty = state.foodOrder.selectedDishes[id] || 1;
    if (dish) foodTotal += dish.price * qty;
  });

  return {
    roomTotal,
    foodTotal,
    grandTotal: roomTotal + foodTotal,
    discountData
  };
}

// ۱۲. مدال پیش‌نمایش و ارسال پیام به گروه رزرو
let currentModalMessage = "";
let currentGroupMessage = "";

function openMessagePreviewModal({ title, subtitle, messageText, actionType }) {
  // بررسی نهایی قانون ۲ نوع خوراک: مجموع باید حداقل ۱۰ پرس باشد، وگرنه یکی از دو خوراک باید حذف شود
  const currentDishIds = Object.keys(state.foodOrder.selectedDishes);
  if (currentDishIds.length > 1) {
    const portionsCount = currentDishIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);
    if (portionsCount < 10) {
      checkGroupRuleViolation(() => {
        updateReservationCalculations();
        const refreshedText = generateUnifiedOrderMessage('guest');
        openMessagePreviewModal({
          title: title,
          subtitle: subtitle,
          messageText: refreshedText,
          actionType: actionType
        });
      });
      return;
    }
  }

  currentModalMessage = messageText || generateUnifiedOrderMessage('guest');
  currentGroupMessage = generateUnifiedOrderMessage('group');
  const titleEl = document.getElementById("modal-title");
  const subtitleEl = document.getElementById("modal-subtitle");
  const previewEl = document.getElementById("modal-message-preview");
  
  if (titleEl) titleEl.textContent = title || "پیش‌نمایش درخواست شما";
  if (subtitleEl) subtitleEl.textContent = subtitle || "خلاصه درخواست شما جهت بررسی و ارسال نهایی:";
  if (previewEl) previewEl.textContent = currentModalMessage;

  // ۱. نام و شماره تماس در دو ستون مجزا
  const guestName = state.reservation.name || state.foodOrder.name || "مهمان گرامی";
  const guestPhone = state.reservation.phone || state.foodOrder.phone || "ثبت‌نشده";
  const previewNameEl = document.getElementById("preview-guest-name");
  const previewPhoneEl = document.getElementById("preview-guest-phone");
  if (previewNameEl) previewNameEl.textContent = guestName;
  if (previewPhoneEl) previewPhoneEl.textContent = formatPersianNumber(guestPhone);

  // ۲. تاریخ‌های ورود و خروج کاملاً شمسی و تفکیک‌شده به صورت زیر هم
  const selectedRooms = (state.reservation.selectedRoomIds || []).map(id => ROOMS.find(r => r.id === id)).filter(Boolean);
  const previewDatesCard = document.getElementById("preview-dates-card");
  const previewCheckInEl = document.getElementById("preview-checkin-date");
  const previewCheckOutEl = document.getElementById("preview-checkout-date");
  const previewStayDurationEl = document.getElementById("preview-stay-duration");

  if (selectedRooms.length > 0) {
    if (previewDatesCard) previewDatesCard.style.display = "block";
    const checkInJalali = getJalaliDetails(state.reservation.checkInDate);
    const checkOutJalali = getJalaliDetails(state.reservation.checkOutDate);
    if (previewCheckInEl) previewCheckInEl.textContent = checkInJalali.fullString;
    if (previewCheckOutEl) previewCheckOutEl.textContent = checkOutJalali.fullString;
    if (previewStayDurationEl) {
      previewStayDurationEl.textContent = `${formatPersianNumber(state.reservation.nights)} شب (از ${checkInJalali.weekday} تا ${checkOutJalali.weekday}) • ${formatPersianNumber(state.reservation.guests)} نفر`;
    }
  } else {
    if (previewDatesCard) previewDatesCard.style.display = "none";
  }

  // ۳. اسم اتاق و تعداد رزرو شده برای آن اتاق
  const previewRoomsCard = document.getElementById("preview-rooms-card");
  const previewRoomsBadge = document.getElementById("preview-rooms-count-badge");
  const previewRoomsList = document.getElementById("preview-rooms-list");

  if (selectedRooms.length > 0) {
    if (previewRoomsCard) previewRoomsCard.style.display = "block";
    const totalGuests = state.reservation.guests || selectedRooms.reduce((sum, r) => sum + ((state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2), 0);
    if (previewRoomsBadge) previewRoomsBadge.textContent = `${formatPersianNumber(selectedRooms.length)} اتاق (${formatPersianNumber(totalGuests)} نفر)`;

    if (previewRoomsList) {
      previewRoomsList.innerHTML = selectedRooms.map(r => {
        const g = (state.reservation.roomGuests && state.reservation.roomGuests[r.id]) || r.baseCapacity || 2;
        const costInfo = calculateRoomNightCost(r, g);
        return `
          <div class="preview-room-item" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.06);">
            <div>
              <span style="font-weight: 800; color: var(--brand-green); font-size: 13.5px;">🏠 اتاق ${r.name}</span>
              ${costInfo.extraGuests > 0 ? `<span style="font-size: 11px; color: var(--brand-text-muted); display: block;">${formatPersianNumber(costInfo.baseGuests)} نفر اصلی + ${formatPersianNumber(costInfo.extraGuests)} نفر اضافه (با ۱۰٪ تخفیف)</span>` : ''}
            </div>
            <span style="font-weight: 800; color: var(--brand-mustard-dark); font-size: 12.5px; background: rgba(220,165,70,0.12); padding: 3px 8px; border-radius: 6px;">
              ${formatPersianNumber(g)} نفر
            </span>
          </div>
        `;
      }).join("");
    }
  } else {
    if (previewRoomsCard) previewRoomsCard.style.display = "none";
  }

  // ۴. خلاصه غذا در صورت سفارش
  const previewFoodCard = document.getElementById("preview-food-card");
  const previewFoodList = document.getElementById("preview-food-list");
  const scheduled = state.foodOrder.scheduledMeals || [];
  const currentFoodIds = Object.keys(state.foodOrder.selectedDishes || {});

  if (scheduled.length > 0 || currentFoodIds.length > 0) {
    if (previewFoodCard) previewFoodCard.style.display = "block";
    let foodItemsHtml = "";
    if (scheduled.length > 0) {
      foodItemsHtml += scheduled.map(m => {
        const mJalali = getJalaliDetails(m.date);
        const dishes = m.dishes.map(d => `${d.name} (${formatPersianNumber(d.quantity)} پرس)`).join("، ");
        return `<div style="margin-bottom: 4px;">• وعده ${m.mealType} (${mJalali.weekday}): ${dishes}</div>`;
      }).join("");
    }
    if (currentFoodIds.length > 0) {
      const curNames = currentFoodIds.map(id => {
        const d = FOOD_MENU.find(x => x.id === id);
        return `${d ? d.name : id} (${formatPersianNumber(state.foodOrder.selectedDishes[id])} پرس)`;
      }).join("، ");
      foodItemsHtml += `<div>• وعده جاری (${state.foodOrder.mealType || 'ناهار'}): ${curNames}</div>`;
    }
    if (previewFoodList) previewFoodList.innerHTML = foodItemsHtml;
  } else {
    if (previewFoodCard) previewFoodCard.style.display = "none";
  }

  // ۵. توضیحات و ملاحظات خاص مهمان
  const previewNotesCard = document.getElementById("preview-notes-card");
  const previewNotesText = document.getElementById("preview-notes-text");
  const guestNotes = state.reservation.notes || state.foodOrder.notes || document.getElementById("res-notes")?.value.trim() || document.getElementById("food-notes")?.value.trim() || "";
  if (guestNotes) {
    if (previewNotesCard) previewNotesCard.style.display = "block";
    if (previewNotesText) previewNotesText.textContent = guestNotes;
  } else {
    if (previewNotesCard) previewNotesCard.style.display = "none";
  }

  // ۶. جمع کل برآورد
  const previewGrandTotal = document.getElementById("preview-grand-total");
  const totals = calculateCurrentTotals();
  if (previewGrandTotal) {
    previewGrandTotal.textContent = formatToman(totals.grandTotal);
  }

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

  // بررسی نهایی قانون دو خوراک قبل از ارسال مستقیم
  const currentDishIds = Object.keys(state.foodOrder.selectedDishes);
  if (currentDishIds.length > 1) {
    const portionsCount = currentDishIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);
    if (portionsCount < 10) {
      closeMessageModal();
      checkGroupRuleViolation(() => {
        executeSubmitFoodOrderForm();
      });
      return;
    }
  }

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

  // بررسی نهایی قانون دو خوراک قبل از اشتراک‌گذاری در تلگرام
  const currentDishIds = Object.keys(state.foodOrder.selectedDishes);
  if (currentDishIds.length > 1) {
    const portionsCount = currentDishIds.reduce((sum, id) => sum + (Number(state.foodOrder.selectedDishes[id]) || 0), 0);
    if (portionsCount < 10) {
      closeMessageModal();
      checkGroupRuleViolation(() => {
        executeSubmitFoodOrderForm();
      });
      return;
    }
  }

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
 * ۳. ارسال متن درخواست از طریق اشتراک در تلگرام (بدون افشای لینک خصوصی گروه)
 */
function sendDirectToReservationGroup() {
  triggerHaptic('medium');
  const msgToSend = currentGroupMessage || currentModalMessage;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msgToSend).catch(() => {});
  }
  const shareUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(msgToSend)}`;
  showToast("در حال باز کردن تلگرام با متن مخصوص گروه رزرو...");

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

  // ارسال فرمت خلاصه و بدون موارد اضافی مخصوص گروه رزرو
  const groupMessageToSend = currentGroupMessage || generateUnifiedOrderMessage('group');

  const reqBody = JSON.stringify({
    action: "submit_reservation",
    isMiniAppOrder: true,
    botToken: "691903257:AAFeOUEmpfHkElZUb8JFUTmOhLU79b6--zQ",
    chatId: "-1004485664573",
    message: groupMessageToSend,
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
      sendBtn.innerHTML = originalBtnHtml || "🚀 ارسال خودکار درخواست رزرو";
    }

    if (res.ok && data && (data.ok === true || data.forwarded_to_group === true)) {
      triggerHaptic('success');
      showToast("✅ درخواست با موفقیت در سیستم اقامتگاه ثبت شد.");
      const previewEl = document.getElementById("modal-message-preview");
      if (previewEl) {
        previewEl.innerHTML = `
          <div style="background: #e6f7f4; border: 1px solid #1f8578; color: #13524a; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 6px;">🎉</div>
            <div style="font-size: 15px; font-weight: 800; margin-bottom: 6px;">درخواست شما با موفقیت ثبت گردید!</div>
            <div style="font-size: 12.5px; line-height: 1.6; color: #2d4d42;">
              پیام شما با موفقیت برای اقامتگاه ارسال شد. میزبان پیام شما را بررسی کرده و به زودی جهت هماهنگی نهایی با شما تماس خواهد گرفت.
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
            <strong>⚠️ وضعیت ثبت درخواست:</strong><br/>
            ${errNote}<br/>
            <span style="font-size: 11.5px; color: #7c2d12;">متن کامل درخواست در حافظه کپی شد؛ می‌توانید از گزینه‌های اشتراک در تلگرام یا ارسال پیامک مستقیم به میزبان استفاده فرمایید.</span>
          </div>
          <div style="white-space: pre-wrap; font-family: monospace; font-size: 12px; max-height: 120px; overflow-y: auto;">${currentModalMessage}</div>
        `;
      }
    }
  })
  .catch(err => {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerHTML = originalBtnHtml || "🚀 ارسال خودکار درخواست رزرو";
    }
    console.warn("Worker submission network notice:", err);
    triggerHaptic('warning');
    showToast("متن کپی شد. می‌توانید از دکمه اشتراک یا پیامک استفاده فرمایید.");
    shareViaTelegram();
  });
}

// پنهان‌سازی سریع اعلان Toast با انیمیشن روان
function hideToast() {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  if (toastTimeout) {
    clearTimeout(toastTimeout);
    toastTimeout = null;
  }
  toast.classList.remove("show");
  setTimeout(() => {
    if (!toast.classList.contains("show")) {
      toast.style.visibility = "hidden";
    }
  }, 220);
}
window.hideToast = hideToast;

// نمایش پیام Toast همراه با دکمه بستن
let toastTimeout = null;
function showToast(msg) {
  const toast = document.getElementById("app-toast");
  if (!toast) return;
  const toastText = document.getElementById("toast-text") || toast;
  toastText.textContent = msg;

  const isBarVisible = document.body.classList.contains("has-floating-bar");
  if (isBarVisible) {
    toast.style.bottom = "96px";
  } else {
    toast.style.bottom = "24px";
  }

  toast.style.visibility = "visible";
  void toast.offsetWidth; // ریفلو مرورگر برای اجرای درست انیمیشن
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    hideToast();
  }, 4500);
}
window.showToast = showToast;

// مدیریت کلیک روی لینک‌های شبکه‌های اجتماعی و وب‌سایت در وب و تلگرام
function handleSocialLinkClick(e, url) {
  if (e) {
    try { e.stopPropagation(); } catch (_) {}
  }
  if (tg && tg.openLink) {
    try {
      e?.preventDefault();
      tg.openLink(url);
      return;
    } catch (_) {}
  }
}
window.handleSocialLinkClick = handleSocialLinkClick;

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
  const foodDateDisplay = document.getElementById("food-date-shamsi-display");
  if (foodDateDisplay) {
    const jDetails = getJalaliDetails(state.foodOrder.date);
    foodDateDisplay.textContent = jDetails.fullString;
  }

  // اگر نام کاربر در تلگرام موجود بود، فیلدهای نام را پر می‌کنیم
  if (state.reservation.name) {
    const resNameEl = document.getElementById("res-name");
    const foodNameEl = document.getElementById("food-name");
    if (resNameEl) resNameEl.value = state.reservation.name;
    if (foodNameEl) foodNameEl.value = state.foodOrder.name;
  }

  // اتصال کنترل هوشمند و اعتبارسنجی دقیق فیلدهای شماره تماس (دقیقاً ۱۱ رقم با شروع ۰۹)
  function setupPhoneInputValidation(inputId, syncWithId) {
    const el = document.getElementById(inputId);
    if (!el) return;
    el.maxLength = 11;
    el.setAttribute("maxlength", "11");

    el.addEventListener("input", (e) => {
      let eng = toEnglishDigits(e.target.value);
      // تبدیل +98 یا 0098 به 0
      if (eng.startsWith("+98")) eng = "0" + eng.slice(3);
      if (eng.startsWith("0098")) eng = "0" + eng.slice(4);
      if (eng.startsWith("989") && eng.length >= 12) eng = "0" + eng.slice(2);

      // فقط ارقام مجاز باشند و حداکثر ۱۱ رقم
      let digits = eng.replace(/\D/g, "");

      // اگر کاربر شماره را بدون صفر آغازین وارد کرد (مثلاً 9123456789)
      if (digits.startsWith("9") && digits.length === 10) {
        digits = "0" + digits;
      }

      // قطع سخت‌گیرانه هر رقمی بیش از ۱۱ رقم
      if (digits.length > 11) {
        digits = digits.slice(0, 11);
      }

      if (e.target.value !== digits) {
        e.target.value = digits;
      }
      state.reservation.phone = digits;
      state.foodOrder.phone = digits;
      const syncEl = document.getElementById(syncWithId);
      if (syncEl && syncEl.value !== digits) {
        syncEl.value = digits;
      }
    });

    el.addEventListener("blur", (e) => {
      const val = e.target.value ? e.target.value.trim() : "";
      if (val) {
        const check = validateIranianMobile(val);
        if (!check.valid) {
          triggerHaptic('warning');
          showToast(check.error);
        }
      }
    });
  }
  setupPhoneInputValidation("res-phone", "food-phone");
  setupPhoneInputValidation("food-phone", "res-phone");

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

  // شماره‌های تماس بخش اطلاعات تماس در صفحه اصلی
  const homePhone1El = document.getElementById("home-phone-display-1");
  if (homePhone1El) homePhone1El.textContent = CONFIG.phone1Display;
  const homePhone2El = document.getElementById("home-phone-display-2");
  if (homePhone2El) homePhone2El.textContent = CONFIG.phone2Display;

  // اتصال کنترل‌های اسکرول صفحه غذا و همگام‌سازی لحظه‌ای نام و تلفن
  const btnScrollTop = document.getElementById("btn-food-dock-top");
  if (btnScrollTop) {
    btnScrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      scrollFoodScreen('top');
    });
  }

  const btnScrollBottom = document.getElementById("btn-food-dock-bottom");
  if (btnScrollBottom) {
    btnScrollBottom.addEventListener("click", (e) => {
      e.preventDefault();
      scrollFoodScreen('bottom');
    });
  }

  const boxScrollTop = document.getElementById("box-food-scroll-top");
  if (boxScrollTop) {
    boxScrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      scrollFoodScreen('top');
    });
  }

  const btnFormScrollTop = document.getElementById("btn-food-form-scroll-top");
  if (btnFormScrollTop) {
    btnFormScrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      scrollFoodScreen('top');
    });
  }

  const foodNameInput = document.getElementById("food-name");
  if (foodNameInput) {
    foodNameInput.addEventListener("input", (e) => handleGuestNameSync(e.target.value));
    foodNameInput.addEventListener("change", (e) => handleGuestNameSync(e.target.value));
  }

  const resNameInput = document.getElementById("res-name");
  if (resNameInput) {
    resNameInput.addEventListener("input", (e) => handleGuestNameSync(e.target.value));
    resNameInput.addEventListener("change", (e) => handleGuestNameSync(e.target.value));
  }

  const foodPhoneInput = document.getElementById("food-phone");
  if (foodPhoneInput) {
    foodPhoneInput.addEventListener("input", (e) => handleGuestPhoneSync(e.target.value));
    foodPhoneInput.addEventListener("change", (e) => handleGuestPhoneSync(e.target.value));
  }

  const resPhoneInput = document.getElementById("res-phone");
  if (resPhoneInput) {
    resPhoneInput.addEventListener("input", (e) => handleGuestPhoneSync(e.target.value));
    resPhoneInput.addEventListener("change", (e) => handleGuestPhoneSync(e.target.value));
  }

  // پیوند رویدادهای بازگشت به صفحه اول در کل برنامه
  const headerBrandClickable = document.getElementById("header-brand-clickable");
  if (headerBrandClickable) {
    headerBrandClickable.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateTo("screen-home");
    });
  }

  document.querySelectorAll(".screen-home-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigateTo("screen-home");
    });
  });

  // رندر بخش‌ها
  renderRoomsList();
  renderFoodSection();
  renderSelectedRoomsInForm();
  updateReservationCalculations();
  updateFloatingBookingBar();
});

// اکسپورت توابع به پنجره سراسری (Global Window) برای دسترسی آسان در رویدادهای HTML
window.handleGuestNameSync = handleGuestNameSync;
window.handleGuestPhoneSync = handleGuestPhoneSync;
window.navigateTo = navigateTo;
window.navigateToHome = () => navigateTo("screen-home");
window.navigateBack = navigateBack;
window.openExternalUrl = openExternalUrl;
window.openRoomDetail = openRoomDetail;
window.selectRoomAndBook = selectRoomAndBook;
window.updateRoomDetailButtons = updateRoomDetailButtons;
window.handleRoomDetailBookingClick = handleRoomDetailBookingClick;
window.startReservationForCurrentRoom = startReservationForCurrentRoom;
window.openReservationScreen = openReservationScreen;
window.removeRoomFromReservation = removeRoomFromReservation;
window.renderSelectedRoomsInForm = renderSelectedRoomsInForm;
window.updateFloatingBookingBar = updateFloatingBookingBar;
window.dismissFloatingBookingBar = dismissFloatingBookingBar;
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
window.autoCompletePortionsToTen = autoCompletePortionsToTen;
window.saveFoodAndReturnToReservation = saveFoodAndReturnToReservation;
window.submitFoodOrderForm = submitFoodOrderForm;
window.closeGroupRuleModal = closeGroupRuleModal;
window.resolveGroupConflictKeepSingle = resolveGroupConflictKeepSingle;
window.resolveGroupConflictIncreaseToAboveTen = resolveGroupConflictIncreaseToAboveTen;
window.resolveGroupConflictReplaceWithNew = resolveGroupConflictReplaceWithNew;
window.closeMessageModal = closeMessageModal;
window.copyModalMessage = copyModalMessage;
window.sendToBarzokTelegramAccount = sendToBarzokTelegramAccount;
window.shareViaTelegram = shareViaTelegram;
window.sendDirectToReservationGroup = sendDirectToReservationGroup;
window.sendViaSMS = sendViaSMS;
window.sendViaTelegram = sendViaTelegram;
window.showToast = showToast;
window.openShamsiDatePicker = openShamsiDatePicker;
window.closeShamsiDatePicker = closeShamsiDatePicker;
window.changeShamsiCalendarMonth = changeShamsiCalendarMonth;
window.selectShamsiCalendarDay = selectShamsiCalendarDay;
window.pickQuickShamsiDate = pickQuickShamsiDate;
window.changeRoomCount = changeRoomCount;
window.changeRoomGuests = changeRoomGuests;
window.navigateToFoodFromReservation = navigateToFoodFromReservation;
window.navigateToReservationFromFood = navigateToReservationFromFood;
window.clearStayFromFoodOrder = clearStayFromFoodOrder;
window.clearFoodFromReservation = clearFoodFromReservation;
window.scrollFoodScreen = scrollFoodScreen;
window.openRoomsFromFood = openRoomsFromFood;
window.openReservationFromFood = openReservationFromFood;
window.returnToFoodFromRooms = returnToFoodFromRooms;
window.quickAddRoomToStay = quickAddRoomToStay;
window.changeRoomGuestsFromFood = changeRoomGuestsFromFood;
window.removeRoomFromFoodOrder = removeRoomFromFoodOrder;
window.changeStayNightsFromFood = changeStayNightsFromFood;
window.removeScheduledMeal = removeScheduledMeal;
window.addCurrentMealToSchedule = addCurrentMealToSchedule;
window.quickAddBreakfastMeal = quickAddBreakfastMeal;
window.CONFIG = CONFIG;
window.ROOMS = ROOMS;
window.FOOD_MENU = FOOD_MENU;
window.requestTelegramContact = requestTelegramContact;
window.fillTelegramPhone = fillTelegramPhone;
window.updateTelegramUserBadges = updateTelegramUserBadges;

