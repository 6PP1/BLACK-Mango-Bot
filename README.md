BLACK-MANGO-BOT - شرح البوت

📌 تعريف:
BLACK-MANGO-BOT هو بوت Discord مخصص لإدارة التفاعل داخل السيرفر باستخدام نظام النقاط (XP).
يساعد على تحفيز المستخدمين من خلال نظام مستويات وترتيب.

---

⚙️ فكرة عمل البوت:

* يمنح المستخدمين نقاط (XP) عند إرسال الرسائل
* يتم تخزين البيانات في قاعدة MongoDB
* يتم تحويل النقاط إلى مستويات (Levels)
* يوفر ترتيب (Leaderboard) لأفضل الأعضاء

---

🚀 المميزات:

* نظام XP تلقائي
* نظام Levels (ترقية تلقائية)
* نظام ترتيب المستخدمين
* أوامر تفاعلية
* دعم قاعدة بيانات MongoDB
* سهل التعديل والتطوير

---

📂 هيكلة المشروع:

* example.js → الملف الرئيسي لتشغيل البوت
* package.json → يحتوي على المكتبات والإعدادات
* .env → يحتوي على بيانات حساسة (غير مرفوع)
* README.md → شرح المشروع

---

🔐 شرح ملف .env:

BOT_TOKEN=YOUR_BOT_TOKEN
→ التوكن الخاص بالبوت من Discord Developer Portal

CLIENT_ID=YOUR_CLIENT_ID
→ معرف التطبيق (Client ID)

MONGO_URI=YOUR_MONGO_URI
→ رابط الاتصال بقاعدة البيانات MongoDB

DB_NAME=discord-leveling
→ اسم قاعدة البيانات

---

🚀 طريقة التشغيل:

1. تحميل المشروع:
   git clone https://github.com/6PP1/BLACK-Mango-Bot

2. الدخول إلى المجلد:
   cd BLACK-Mango-Bot

3. تثبيت المكتبات:
   npm install

4. إنشاء ملف .env وإضافة البيانات

5. تشغيل البوت:
   node example.js

---

📜 أوامر البوت (مثال):
/xp       → عرض نقاط المستخدم
/level    → عرض المستوى
/top      → عرض أفضل المستخدمين
/help     → قائمة الأوامر

---

⚠️ ملاحظات مهمة:

* لا ترفع ملف .env إلى GitHub
* تأكد من تغيير التوكن في حال تم تسريبه
* تأكد من تشغيل MongoDB بشكل صحيح
* أضف .env داخل .gitignore

---

🛠️ التقنيات المستخدمة:

* Node.js
* Discord.js
* MongoDB

---

👨‍💻 المطور: Discord : 6p_9

server dev : https://discord.gg/nT4vpMvaST

---
