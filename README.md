BLACK-MANGO-BOT - شرح البوت

📌 تعريف:
هذا البوت يساعد أعضاء السيرفر على إنشاء روابط MongoDB ديناميكية بسهولة.
يمكن لكل عضو إنشاء رابط خاص به، وحذفه، وعرض الرابط الحالي.

----------------------------------------

⚙️ فكرة عمل البوت:
- إنشاء Cluster جديد في MongoDB Atlas لكل مستخدم
- إنشاء Database User لكل Cluster
- السماح بالوصول لكل IP
- حفظ الرابط في قاعدة بيانات MongoDB داخل السيرفر
- التحكم بالروابط عبر أزرار داخل Discord

----------------------------------------

📂 الملفات الأساسية:
- example.js → الملف الرئيسي لتشغيل البوت
- package.json → المكتبات والإعدادات
- .env → يحتوي معلومات حساسة (توكن + قاعدة البيانات)
- README.txt → هذا الشرح

----------------------------------------

🔐 ملف .env (سري):
BOT_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
MONGO_URI=YOUR_MONGO_URI
ATLAS_PUBLIC_KEY=YOUR_ATLAS_PUBLIC_KEY
ATLAS_PRIVATE_KEY=YOUR_ATLAS_PRIVATE_KEY
ATLAS_PROJECT_ID=YOUR_PROJECT_ID
CHANNEL_ID=YOUR_CHANNEL_ID

⚠️ لا تشارك ملف .env أو ترفعه على GitHub.

----------------------------------------

🚀 طريقة التشغيل:
1. تثبيت المكتبات:
   npm install
2. إنشاء ملف .env ووضع البيانات الصحيحة
3. تشغيل البوت:
   node example.js

----------------------------------------

📜 أوامر البوت:
- Create Link → إنشاء رابط MongoDB جديد
- Delete Link → حذف الرابط الحالي
- My Links → عرض الرابط الخاص بك

----------------------------------------

👨‍💻 المطور:
Discord : 6p_9

🌐 سيرفر التطوير:
https://discord.gg/nT4vpMvaST

----------------------------------------
