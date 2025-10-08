# ReactionRolesPro

بوت إدارة الرولات باستخدام **Slash Commands**.
جاهز للرفع على bot-hosting.net أو Render.

## المميزات
- إنشاء رسالة رولات تفاعلية عبر `/setup`
- إضافة/تعديل/إزالة رولات عبر `/addrole`, `/editrole`, `/removerole`
- يدعم **الأزرار** و**الرياكشن (الإيموجي)** — تختار عند الإضافة
- تخزين إعدادات لكل سيرفر في `Json-db/reactionDB.json` باستخدام `st.db`
- فقط من يمتلك `MANAGE_ROLES` يقدر يستخدم أوامر الإعداد
- مصمم للعمل كـ بوت مستقل (يمكن تشغيل بوتين في نفس السيرفر)

## تشغيل محلي
1. انسخ `.env.example` إلى `.env` وأدخل القيم.
2. ثبت الاعتمادات: `npm install`
3. سجل السلاش كوماند: `npm run deploy-commands`
4. شغّل البوت: `npm start`

## رفع على bot-hosting.net / Render
- ارفع المشروع، وأضف متغيرات البيئة `TOKEN` و`CLIENT_ID` (و`GUILD_ID` إن رغبت).
- Build command: `npm install`
- Start command: `npm start`

