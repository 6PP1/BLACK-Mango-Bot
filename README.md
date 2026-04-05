Copilot said: الآن دعني أحصل على محتوى الملفات الرئيسية:#
الآن دعني أحصل على محتوى الملفات الرئيسية:# 📊 شرح شامل لمشروع Mango

🎯 نظرة عامة
Mango هو بوت Discord متقدم يربط بين Discord و MongoDB Atlas، يسمح للمستخدمين بإنشاء وإدارة روابط قواعد بيانات MongoDB بشكل سهل وسريع من خلال Discord.

📁 هيكل المشروع
Code
mango/
├── index.js          # ملف البوت الرئيسي
├── package.json      # معلومات المشروع والمكتبات
├── .gitignore        # ملفات لتجاهلها في Git
└── README.md         # توثيق المشروع
🔧 المكتبات المستخدمة
المكتبة	الإصدار	الوظيفة
discord.js	^14.0.0	بناء بوت Discord
mongodb	^6.0.0	الاتصال بقاعدة بيانات MongoDB
axios	^1.6.0	طلبات HTTP
@mhoc/axios-digest-auth	^0.8.0	مصادقة Digest للاتصال بـ MongoDB Atlas API
dotenv	^16.0.0	إدارة متغيرات البيئة
🔑 متغيرات البيئة (Environment Variables)
يتطلب المشروع إعداد ملف .env يحتوي على:

env
DISCORD_TOKEN=         # توكن البوت من Discord
CLIENT_ID=             # معرّف العميل من Discord
MONGO_URI=             # رابط الاتصال بـ MongoDB
ATLAS_PUBLIC_KEY=      # المفتاح العام لـ MongoDB Atlas API
ATLAS_PRIVATE_KEY=     # المفتاح الخاص لـ MongoDB Atlas API
ATLAS_PROJECT_ID=      # معرّف مشروع MongoDB Atlas
CHANNEL_ID=            # معرّف القناة في Discord
🚀 الميزات الرئيسي��
1️⃣ إنشاء رابط MongoDB
Code
الزر: Create Link 🪣
إنشاء cluster جديد في MongoDB Atlas تلقائياً
إنشاء مستخدم وكلمة مرور
السماح بـ الاتصالات من أي IP
إرجاع رابط الاتصال للمستخدم
حفظ البيانات في قاعدة البيانات المحلية
المدة: 2-3 دقائق

2️⃣ عرض الروابط الموجودة
Code
الزر: My Links 🔍
عرض رابط MongoDB الخاص بالمستخدم
عرض تاريخ الإنشاء بصيغة نسبية
3️⃣ حذف الروابط
Code
الزر: Delete Link 🗑️
حذف الـ cluster من MongoDB Atlas
حذف بيانات المستخدم من قاعدة البيانات
🏗️ البنية التقنية
الأوامر (Functions)
الدالة	الوصف
atlasRequest()	إرسال طلبات HTTP مع Digest Auth إلى MongoDB Atlas API
createCluster()	إنشاء cluster جديد
waitForCluster()	انتظار جاهزية الـ cluster (تصل إلى 30 محاولة كل 10 ثواني)
createDBUser()	إنشاء مستخدم قاعدة بيانات
allowAllIPs()	السماح بالاتصالات من أي عنوان IP
getConnectionString()	الحصول على رابط الاتصال
deleteCluster()	حذف cluster
generatePassword()	توليد كلمة مرور عشوائية آمنة
التفاعلات (Interactions)
handleCreateLink() - معالج زر الإنشاء
handleDeleteLink() - معالج زر الحذف
handleMyLinks() - معالج زر عرض الروابط
📋 معلومات قاعدة البيانات
Collection: links
JavaScript
{
  userId: "123456789",
  projectId: "atlas_project_id",
  clusterName: "cluster-abc123",
  connectionString: "mongodb+srv://user:pass@...",
  createdAt: Date
}
Collection: config
JavaScript
{
  key: "panel_message",
  messageId: "message_id"
}
🎨 واجهة المستخدم
الرسالة الرئيسية (Main Embed)
عنوان: 📊 MongoDB Link Creator
وصف عربي: "نظام إنشاء روابط MongoDB"
لون: أخضر (#00ED64)
رسائل الحالة
⏳ جاري المعالجة - برتقالي
✅ نجح - أخضر
❌ خطأ - أحمر
⚠️ تحذير - برتقالي
📊 حالة المشروع الحالية
المعلومة	التفاصيل
تاريخ الإنشاء	5 أبريل 2026
عدد الـ Commits	3
الفرع الرئيسي	main
الحالة	مفتوح (Open)
عدد الـ Issues	1 (BLACK)
عدد الـ Pull Requests	0
📝 سجل الـ Commits
First commit - الإنشاء الأولي
ignore env file - إضافة .gitignore
add project files - إضافة ملفات المشروع
🔒 الأمان
✅ نقاط قوية:

متغيرات البيئة محمية (في .env)
كلمات مرور عشوائية آمنة (20 حرف)
الرسائل الحساسة مرئية فقط للمستخدم (flags: 64 = ephemeral)
⚠️ نقاط محتملة للتحسين:

السماح بجميع IPs قد يكون خطراً في بعض الحالات
يجب إضافة معالجة أفضل للأخطاء والتحقق من الصلاحيات
🎯 الاستخدام
bash
# تثبيت المكتبات
npm install

# تشغيل البوت
npm start
هذا المشروع يجمع بين Discord و MongoDB Atlas بطريقة ذكية جداً! 🚀
