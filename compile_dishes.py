import json

with open("denu_menu.json", "r", encoding="utf-8") as f:
    categories = json.load(f)

dishes = []
for cat in categories:
    cname = cat["category"]
    for it in cat["items"]:
        name = it["name"].strip()
        price = it["price"]
        ing = it["ingredients"]
        img = ("https://storage.denu.app/storage" + it["images"][0]) if it["images"] else ""
        
        # Determine tags based on category & ingredients
        tags = []
        if cname == "خوراک‌های گوشتی با برنج":
            tags = ["همراه با برنج", "گوشتی"]
        elif cname == "خوراک‌های گوشتی با نان":
            tags = ["نانی", "گوشتی"]
        elif cname == "خوراک‌های گیاهی":
            if any("برنج" in i or "پلو" in i for i in ing) or "پلو" in name or "چلو" in name or "ته‌چین" in name or "ته چین" in name or "دمپخت" in name:
                tags = ["همراه با برنج", "گیاهی"]
            else:
                tags = ["نانی", "گیاهی"]
        elif cname == "آش و سوپ":
            tags = ["آش و سوپ", "گوشتی" if any("مرغ" in i or "گوشت" in i for i in ing) else "گیاهی"]
        elif cname == "صبحانه":
            tags = ["صبحانه سنتی", "نانی"]

        desc = ""
        if "گوشت و لوبیا" in name:
            name = "گوشت لوبیا کاشان (غذای اصیل سنتی)"
            desc = "خوراک سنتی گوشت گوسفندی پخته‌شده با لوبیای سفید با دارچین فراوان همراه با شوید پلو"
        elif "شاتوت پلو" in name:
            desc = "شاتوت تازه باغات برزک همراه با گوشت گوسفندی، رب انار و پلوی زعفرانی اصیل ایرانی"
        elif "دیزی پلو" in name:
            desc = "پلوی لذیذ دم‌پخت شده با گوشت گوسفندی تازه و لوبیای چشم بلبلی"
        elif "مرغ و هویج و آلو" in name:
            desc = "خوراک لذیذ مرغ همراه با خلال هویج، آلو بخارای شیرین و ملس و رب گوجه فرنگی با پلو"
        elif "مرغ کاری" in name:
            desc = "مرغ طعم‌دار شده با ماست محلی و ادویه معطر کاری همراه با برنج ایرانی"
        elif "لوبیا پلو" in name and "گوشتی" in tags:
            desc = "لوبیا پلوی مجلسی با گوشت تکه‌ای گوسفندی، لوبیا سبز تازه و ادویه‌جات معطر"
        elif "تاس کباب" in name or "تاس‌کباب" in name:
            if "همراه با برنج" in tags:
                desc = "تاس‌کباب سنتی با گوشت گوسفندی، بادمجان، گوجه فرنگی، پیاز و سس رب انار ملس همراه با پلو"
            else:
                desc = "تاس‌کباب اصیل گوسفندی با بادمجان و گوجه فرنگی و چاشنی رب انار همراه با نان خشک محلی"
        elif "دمپخت" in name:
            if "گوشتی" in tags:
                desc = "دمپخت لذیذ با گوشت چرخ‌کرده گوسفند، سبزیجات تازه محلی کوهستان و برنج ایرانی"
            else:
                desc = "دمپخت گیاهی مقوی با سبزیجات تازه محلی برزک و برنج ایرانی"
        elif "قیمه ریزه سیب زمینی" in name:
            desc = "کوفته ریزه‌های گوسفندی با سیب‌زمینی و سس رب گوجه‌فرنگی همراه با نان خشک محلی"
        elif "قیمه ریزه بادمجان" in name:
            desc = "کوفته ریزه‌های خوش‌طعم گوسفندی با بادمجان سرخ‌شده و سبزی خشک معطر همراه با نان محلی"
        elif "شفته آب انار" in name:
            desc = "کوفته شفته سنتی برزک و کاشان تهیه شده با گوشت گوسفند و سس ترش و ملس آب انار"
        elif "آبگوشت" in name:
            desc = "آبگوشت اصیل سنتی با گوشت گوسفندی، نخود، لوبیا سفید و سیب‌زمینی در دیزی همراه با نان خشک محلی"
        elif "گوشت و عدس و بادمجان" in name:
            desc = "خوراک مقوی و اصیل گوشت گوسفندی پخته شده با عدس، بادمجان، کشک محلی و پیازداغ"
        elif "کتلت" in name:
            desc = "کتلت سنتی برشته و خانگی تهیه شده از گوشت چرخ‌کرده خالص گوسفندی و سیب‌زمینی"
        elif "ته‌چین" in name or "ته چین" in name:
            ing_sub = "، ".join(ing[:3]) if ing else "زعفران و برنج"
            desc = f"ته‌چین زعفرانی برشته با لایه‌های {ing_sub} و برنج اعلای ایرانی"
        elif "کشک بادمجان" in name:
            desc = "بادمجان کبابی و سرخ‌شده با کشک محلی گوسفندی، نعناع‌داغ، سیرداغ و پیازداغ عسلی"
        elif "کالجوش" in name:
            desc = "کالجوش سنتی با کشک محلی اعلا، پیازداغ، نعناع‌داغ و مغز گردوی باغات برزک همراه با نان خشک"
        elif "یتیمچه" in name:
            desc = "خوراک گیاهی سنتی و سبک با بادمجان، کدو سبز، سیب‌زمینی، گوجه‌فرنگی تازه و سیر"
        elif "کوکو" in name:
            desc = "کوکوی خانگی و تازه تهیه شده از مواد اولیه محلی و تازه برزک"
        elif "اشکنه" in name:
            desc = "اشکنه سیب‌زمینی سنتی (دوپیازه آلو) با پیازداغ فراوان، سیب‌زمینی و رب گوجه‌فرنگی خانگی"
        elif "چلو" in name:
            desc = "برنج درجه یک ایرانی دم‌کشیده با کره محلی و زعفران"
        elif "رشته پلو" in name:
            desc = "رشته‌پلو خانگی با بادمجان، گوجه‌فرنگی تازه و برنج اصیل ایرانی"
        elif "آش رشته" in name:
            desc = "آش رشته سنتی جاافتاده با حبوبات تازه، سبزی محلی و کشک و پیازداغ فراوان"
        elif "آش برنج" in name:
            desc = "آش برنج محلی مقوی با برنج، عدس، لپه، زرشک کوهی و بادام"
        elif "سوپ شیر" in name:
            desc = "سوپ شیر لذیذ و لطیف با گوشت مرغ، خلال هویج، ذرت شیرین و سبزی خشک کوهی"
        elif "صبحانه" in name:
            desc = "صبحانه کامل روستایی: نان گرم، پنیر محلی، کره محلی، انواع مربای خانگی، نیمرو تازه و حلوا ارده"
        else:
            desc = "خوراک سنتی خانگی تهیه شده از مواد اولیه تازه و محلی برزک"

        # Format price with Persian comma
        formatted_price = f"{price:,}".replace(",", "،") + " تومان"

        dishes.append({
            "id": it["id"],
            "name": name,
            "category": cname,
            "tags": tags,
            "price": price,
            "priceDisplay": formatted_price,
            "description": desc,
            "ingredients": ing,
            "image": img
        })

with open("compiled_dishes.json", "w", encoding="utf-8") as f:
    json.dump(dishes, f, ensure_ascii=False, indent=2)

print("Saved", len(dishes), "dishes successfully!")
