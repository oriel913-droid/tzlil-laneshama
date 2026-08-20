# צליל לנשמה OS

מערכת ניהול עסקי לעסק גיטרות "צליל לנשמה". React + TypeScript + Vite +
Tailwind CSS + Zustand + Supabase. עברית, RTL, Mobile First.

מסמך המקור המחייב לכל החלטת מוצר: `ספר_היסוד_צליל_לנשמה_OS_MASTER_מאפס.docx`.

## מצב נוכחי: Stage 1 – Foundation

שלב זה בנה **רק** את היסודות התפעוליים, לפי סעיף 0.1 בספר היסוד:

- אפליקציית React + TS + Vite רצה.
- חיבור Supabase (Auth + Database) דרך משתני סביבה.
- Login / Logout עובד.
- RTL מלא (עברית) בכל האפליקציה, מובייל ודסקטופ.
- Layout ראשי (Top bar + ניווט).
- RBAC גמיש (roles / permissions / role_permissions / user_roles),
  לא מקודד לפי שמות תפקידים.
- תשתית Audit Log (טבלה בלתי-הפיכה + RLS).
- 5 migrations ראשונות מתועדות.
- דפוס Repository (LocalRepository ל-dev, SupabaseRepository ל-production)
  — ה-UI אף פעם לא קורא ל-Supabase ישירות.

**לא נבנה בשלב זה** (בכוונה, לפי סעיף 0.3): CRM, מלאי, מכירות, קונסיגנציה,
דשבורד מלא, אינטגרציות WhatsApp/רשתות חברתיות, AI 'צליל'.

## הרצה מקומית

דרישות: Node.js 20+‎, npm.

```bash
npm install
cp .env.example .env
# ערוך/י את .env והזן/י VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY
npm run dev
```

האפליקציה תעלה בכתובת http://localhost:5173.

### פיתוח בלי Supabase מחובר (מצב Local)

אם עדיין אין פרויקט Supabase מוכן, ניתן לפתח את ה-UI במצב מקומי בלבד:

```bash
# ב-.env:
VITE_DATA_MODE=local
```

במצב זה ה-Repository משתמש ב-`LocalUserProfileRepository`: כל
אימייל/סיסמה מתקבלים, ומחזירים משתמש admin מדומה. **זהו כלי פיתוח
בלבד ואסור להשתמש בו ב-production.**

## הקמת Supabase (production)

1. צור פרויקט חדש ב-https://supabase.com.
2. ב-SQL Editor, הרץ את קבצי ה-migrations לפי הסדר מהתיקייה
   `supabase/migrations/` (0001 עד 0005).
3. עקוב אחר ההוראות ב-`supabase/seed/seed_admin.sql` ליצירת משתמש
   Admin ראשוני ושיוכו לתפקיד `admin`.
4. העתק את ה-Project URL וה-anon public key מ-Settings → API אל
   קובץ ה-`.env` המקומי (או משתני הסביבה של סביבת ה-deployment).

## בדיקות שבוצעו בשלב זה

- `npx tsc --noEmit` (type-check מלא, ללא הרצת npm install מלאה בסביבת
  הפיתוח של Claude עקב חוסר גישת רשת בסאנדבוקס - **יש להריץ
  `npm install && npm run typecheck` בסביבה אמיתית לפני commit ראשון**).
- בדיקת סוגריים/מבנה קבצים תקין (bracket-balance) על כל קובצי ה-TS/TSX.
- קריאה ידנית של סדר ה-migrations לוודא שאין תלות "קדימה" (למשל
  policy שמפנה לפונקציה שעוד לא הוגדרה) — לכן `profiles` פוצל ל-2
  migrations: יצירת הטבלה (0002) והוספת ה-policies שתלויות ב-RBAC
  (0004), אחרי ש-`fn_is_admin` מוגדרת ב-0003.
- לא נבדק מול Supabase אמיתי (אין גישת רשת בסביבת הפיתוח) — **נדרש
  אימות ידני שלך** מול פרויקט Supabase אמיתי לפני שהשלב נחשב "סגור".

## החלטות שנבחרו כברירת מחדל טכנית (לאישור/שינוי שלך)

לפי הוראת ספר היסוד ("כאשר פרט אינו מוגדר, אל תמציא חוק עסקי חדש: בחר
ברירת מחדל טכנית הפיכה, תעד אותה"):

1. **auto-create profile**: כל משתמש חדש ב-`auth.users` מקבל אוטומטית
   שורת `profiles` (טריגר `fn_handle_new_auth_user`), עם `full_name`
   מ-`raw_user_meta_data` אם קיים, אחרת חלק האימייל שלפני ה-@.
   ניתן לשנות זאת ל"מנהל יוצר פרופיל ידנית" אם תעדיף/י.
2. **הרשאות Stage 1 בלבד**: `permissions` מכילה כרגע רק שלוש הרשאות
   בסיס (`settings.manage_users`, `settings.manage_system`,
   `audit_log.view`). כל מודול עסקי עתידי יוסיף permission keys
   משלו (למשל `crm.edit_customer`) — לא הוגדר עדיין אילו הרשאות
   בדיוק ידרשו employee/teacher_agent/viewer מעבר לתפקיד עצמו,
   בהתאם לסעיף 21 בספר היסוד ("מדיניות הרשאות מפורטת לכל עובד").
3. **audit_log ללא UPDATE/DELETE policy בכלל**: כלומר אף אחד — כולל
   admin — לא יכול לערוך/למחוק רשומת audit דרך הקליינט. זו הפרשנות
   המחמירה ל"Audit Log אינו ניתן לעריכה רגילה" (סעיף 17).
4. **audit_log.insert פתוח לכל authenticated**: כרגע כל משתמש מחובר
   יכול להוסיף רשומת audit (ה-`changed_by` נאכף אוטומטית מ-`auth.uid()`
   ולא ניתן לזייף). ברגע שיהיו RPCs עסקיים (מכירה, קונסיגנציה וכו')
   ניתן להדק את זה כך שרק פונקציות SECURITY DEFINER יכתבו audit.

## פערים / החלטות פתוחות (לא הומצאו, לפי סעיף 21)

- ספק חשבוניות/הנהלת חשבונות — לא רלוונטי לשלב 1.
- מדיניות הרשאות מפורטת מעבר לתפקידי הבסיס — ממתין להחלטתך.
- לא הוגדר תהליך "הזמנת עובד" (invite flow) מסודר — כרגע יצירת
  משתמש נעשית ידנית ב-Supabase Dashboard. אם תרצה/י מסך "ניהול
  משתמשים" בתוך המערכת עצמה, זה שייך למודול Settings בשלב מאוחר יותר.

## השלב הבא

לפי סדר הבנייה (סעיף 19): **Stage 2 – Core data** (customers,
product_models, inventory_items, tasks + migrations/RLS תואמות).
לא יתחיל עד לאישורך על שלב 1.

## מבנה תיקיות

```
src/
  app/          נתיבים, Layout ראשי, שער הרשאות (ProtectedRoute)
  components/   רכיבי UI כלליים (common) ו-layout
  features/     מסכים לפי תחום (auth, dashboard, ...)
  hooks/        useAuth (Context מרכזי למשתמש המחובר)
  lib/          לקוח Supabase (singleton)
  repositories/ דפוס Repository: ממשק + מימוש Local + מימוש Supabase
  services/     שירותים חוצי-מודולים (audit log)
  types/        טיפוסי TS (auth, database rows)
supabase/
  migrations/   5 migrations של שלב 1, ממוספרות וניתנות להרצה בסדר
  seed/         הוראות מתועדות ליצירת Admin ראשוני (לא auto-run)
  functions/    ריק כרגע - ל-Edge Functions עתידיים
```
