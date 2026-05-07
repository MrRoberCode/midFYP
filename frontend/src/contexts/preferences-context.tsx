import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

export const supportedLanguages = [
  { value: "en", label: "English" },
  { value: "ur", label: "اردو" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "hi", label: "हिन्दी" },
  { value: "tr", label: "Türkçe" },
  { value: "zh-CN", label: "简体中文" },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]["value"];

type TranslationMap = Record<string, string>;

const en: TranslationMap = {
  "settings.title": "Settings",
  "settings.description":
    "Manage appearance, language, and data preferences for your writing workspace.",
  "settings.general": "General",
  "settings.appearance": "Appearance",
  "settings.appearanceDescription": "Choose how the interface should look.",
  "settings.language": "Language",
  "settings.languageDescription":
    "Change the language used across the website interface.",
  "settings.dataControls": "Data controls",
  "settings.improveTitle": "Improve the model for everyone",
  "settings.improveDescription":
    "Allow your content to be used to train our models, which makes ChatGPT better for you and everyone who uses it. We take steps to protect your privacy.",
  "settings.learnMore": "Learn more",
  "theme.system": "System",
  "theme.dark": "Dark",
  "theme.light": "Light",
  "chat.newSession": "New Writing Session",
  "chat.sessions": "Writing Sessions",
  "chat.noSessionsTitle": "No writing sessions yet",
  "chat.noSessionsDescription":
    "Start a new writing session to begin creating content with your AI assistant.",
  "chat.noSessionsHint": "Click \"New Writing Session\" to get started",
  "chat.heroTitle": "Your AI Writing Partner",
  "chat.heroDescription":
    "From first drafts to final edits, I'm here to help you write better, faster.",
  "chat.writeToday": "What would you like to write today?",
  "chat.business": "Business",
  "chat.content": "Content",
  "chat.communication": "Communication",
  "chat.creative": "Creative",
  "chat.prompt.business1":
    "Write a professional email to my boss about a project update",
  "chat.prompt.business2":
    "Draft a compelling LinkedIn post about a recent achievement",
  "chat.prompt.business3":
    "Create an executive summary for a quarterly business report",
  "chat.prompt.business4":
    "Write a persuasive proposal for a new marketing campaign",
  "chat.prompt.content1":
    "Write a blog post about emerging trends in my industry",
  "chat.prompt.content2":
    "Create engaging social media captions for a product launch",
  "chat.prompt.content3":
    "Draft a newsletter that drives customer engagement",
  "chat.prompt.content4": "Write compelling product descriptions that convert",
  "chat.prompt.communication1":
    "Rewrite this text to be more clear and concise",
  "chat.prompt.communication2":
    "Improve the tone of this message to sound more professional",
  "chat.prompt.communication3":
    "Create a presentation script that keeps audiences engaged",
  "chat.prompt.communication4":
    "Write customer service responses that build trust",
  "chat.prompt.creative1":
    "Brainstorm innovative solutions for a common problem",
  "chat.prompt.creative2":
    "Generate creative angles for a story or article",
  "chat.prompt.creative3":
    "Develop character backstories for creative writing",
  "chat.prompt.creative4":
    "Create compelling headlines that grab attention",
  "chat.inputPlaceholder":
    "Describe what you'd like to write, or paste text to improve...",
  "chat.pressEnter": "Press Enter to send",
  "chat.shiftEnter": "Shift + Enter for new line",
  "chat.readyTitle": "Ready to Write",
  "chat.readyDescription":
    "Start the conversation and let's create something amazing together.",
  "chat.brandSubtitle": "RH Writing AI • Trained by Rai Muhammad Haider",
  "chat.online": "RH-AI v1.0 • Online",
  "billing.back": "Back to workspace",
  "billing.title": "Plans & Billing",
  "billing.description":
    "Choose the right AI writing plan and manage access from one place.",
  "billing.currentPlan": "Current plan",
  "billing.verifying": "Verifying Stripe checkout and activating your plan...",
  "billing.popular": "Popular",
  "billing.active": "Active",
  "billing.free": "Free",
  "billing.perMonth": "/ month",
  "billing.starting": "Starting checkout...",
  "billing.current": "Current plan",
  "billing.useFree": "Use free plan",
  "billing.upgrade": "Upgrade with Stripe",
  "auth.loading": "Setting up your AI assistant...",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.name": "Name",
  "auth.otp": "OTP",
  "auth.newPassword": "New Password",
  "auth.forgotPassword": "Forgot password?",
  "auth.signUp": "Sign up",
  "auth.logIn": "Log in",
  "auth.alreadyAccount": "Already have an account?",
  "auth.noAccount": "Don't have an account?",
  "auth.backToLogin": "Back to login",
  "auth.createAccount": "Create an Account",
  "auth.createAccountDescription": "Join AI Assistant to start chatting.",
  "auth.creatingAccount": "Creating account...",
  "auth.welcomeBack": "Welcome Back",
  "auth.loginDescription": "Enter your credentials to access your account.",
  "auth.loggingIn": "Logging in...",
  "auth.verifyLoginOtp": "Verify Login OTP",
  "auth.otpDescription": "Enter the OTP sent to your email.",
  "auth.verifying": "Verifying...",
  "auth.resetPassword": "Reset Password",
  "auth.resetDescription": "Enter your email and we will send a reset OTP.",
  "auth.sendOtp": "Send OTP",
  "auth.sending": "Sending...",
  "auth.verifyResetOtp": "Verify Reset OTP",
  "auth.createNewPassword": "Create New Password",
  "auth.newPasswordDescription": "Choose a new password for your account.",
  "auth.updatePassword": "Update Password",
  "auth.updating": "Updating...",
  "auth.logout": "Log out",
  "dialog.deleteTitle": "Delete Writing Session",
  "dialog.deleteDescription":
    "Are you sure you want to delete this writing session? This action cannot be undone and all content will be permanently deleted.",
  "dialog.cancel": "Cancel",
  "dialog.deleteSession": "Delete Session",
  "common.online": "Online",
  "common.connectingChat": "Connecting to chat...",
};

const translations: Record<SupportedLanguage, TranslationMap> = {
  en,
  ur: {
    "settings.title": "ترتیبات",
    "settings.description":
      "اپنے رائٹنگ ورک اسپیس کی ظاہری شکل، زبان، اور ڈیٹا ترجیحات منظم کریں۔",
    "settings.general": "جنرل",
    "settings.appearance": "ظاہری شکل",
    "settings.appearanceDescription":
      "منتخب کریں کہ انٹرفیس کیسا نظر آئے۔",
    "settings.language": "زبان",
    "settings.languageDescription":
      "ویب سائٹ کے انٹرفیس کی زبان تبدیل کریں۔",
    "settings.dataControls": "ڈیٹا کنٹرولز",
    "settings.improveTitle": "سب کے لیے ماڈل کو بہتر بنائیں",
    "settings.improveDescription":
      "اپنے مواد کو ہمارے ماڈلز کی تربیت کے لیے استعمال ہونے دیں، جس سے ChatGPT آپ اور سب کے لیے بہتر ہوتا ہے۔ ہم آپ کی رازداری کے تحفظ کے لیے اقدامات کرتے ہیں۔",
    "settings.learnMore": "مزید جانیں",
    "theme.system": "سسٹم",
    "theme.dark": "ڈارک",
    "theme.light": "لائٹ",
    "chat.newSession": "نیا رائٹنگ سیشن",
    "chat.sessions": "رائٹنگ سیشنز",
    "chat.noSessionsTitle": "ابھی تک کوئی رائٹنگ سیشن نہیں",
    "chat.noSessionsDescription":
      "اپنے AI اسسٹنٹ کے ساتھ مواد بنانا شروع کرنے کے لیے نیا رائٹنگ سیشن شروع کریں۔",
    "chat.noSessionsHint": "\"نیا رائٹنگ سیشن\" پر کلک کر کے شروع کریں",
    "chat.heroTitle": "آپ کا AI رائٹنگ پارٹنر",
    "chat.heroDescription":
      "پہلے ڈرافٹ سے آخری ترمیم تک، میں آپ کو بہتر اور تیز لکھنے میں مدد دیتا ہوں۔",
    "chat.writeToday": "آج آپ کیا لکھنا چاہتے ہیں؟",
    "chat.business": "بزنس",
    "chat.content": "مواد",
    "chat.communication": "کمیونیکیشن",
    "chat.creative": "تخلیقی",
    "chat.prompt.business1":
      "اپنے باس کو پراجیکٹ اپڈیٹ کے بارے میں ایک پروفیشنل ای میل لکھیں",
    "chat.prompt.business2":
      "ایک حالیہ کامیابی پر اثر دار LinkedIn پوسٹ تیار کریں",
    "chat.prompt.business3":
      "سہ ماہی بزنس رپورٹ کے لیے ایگزیکٹو سمری بنائیں",
    "chat.prompt.business4":
      "نئی مارکیٹنگ مہم کے لیے قائل کرنے والی تجویز لکھیں",
    "chat.prompt.content1":
      "اپنی صنعت کے ابھرتے رجحانات پر بلاگ پوسٹ لکھیں",
    "chat.prompt.content2":
      "پروڈکٹ لانچ کے لیے دلچسپ سوشل میڈیا کیپشنز بنائیں",
    "chat.prompt.content3":
      "ایسا نیوز لیٹر تیار کریں جو کسٹمر انگیجمنٹ بڑھائے",
    "chat.prompt.content4": "ایسی پروڈکٹ ڈسکرپشنز لکھیں جو کنورٹ کریں",
    "chat.prompt.communication1":
      "اس متن کو زیادہ واضح اور مختصر بنائیں",
    "chat.prompt.communication2":
      "اس پیغام کے لہجے کو زیادہ پروفیشنل بنائیں",
    "chat.prompt.communication3":
      "ایسا پریزنٹیشن اسکرپٹ بنائیں جو سامعین کو متوجہ رکھے",
    "chat.prompt.communication4":
      "ایسے کسٹمر سروس جوابات لکھیں جو اعتماد پیدا کریں",
    "chat.prompt.creative1":
      "ایک عام مسئلے کے لیے جدید حل سوچیں",
    "chat.prompt.creative2":
      "کہانی یا مضمون کے لیے تخلیقی زاویے پیدا کریں",
    "chat.prompt.creative3":
      "تخلیقی تحریر کے لیے کرداروں کے پس منظر تیار کریں",
    "chat.prompt.creative4":
      "ایسی سرخیاں بنائیں جو فوراً توجہ حاصل کریں",
    "chat.inputPlaceholder":
      "بتائیں آپ کیا لکھنا چاہتے ہیں، یا بہتر بنانے کے لیے متن پیسٹ کریں...",
    "chat.pressEnter": "بھیجنے کے لیے Enter دبائیں",
    "chat.shiftEnter": "نئی لائن کے لیے Shift + Enter",
    "chat.readyTitle": "لکھنے کے لیے تیار",
    "chat.readyDescription":
      "گفتگو شروع کریں اور مل کر کچھ شاندار بناتے ہیں۔",
    "chat.brandSubtitle": "RH Writing AI • تربیت از رائے محمد حیدر",
    "chat.online": "RH-AI v1.0 • آن لائن",
    "billing.back": "ورک اسپیس پر واپس جائیں",
    "billing.title": "پلانز اور بلنگ",
    "billing.description":
      "درست AI رائٹنگ پلان منتخب کریں اور ایک ہی جگہ سے رسائی منظم کریں۔",
    "billing.currentPlan": "موجودہ پلان",
    "billing.verifying":
      "Stripe checkout کی تصدیق اور آپ کا پلان فعال کیا جا رہا ہے...",
    "billing.popular": "مقبول",
    "billing.active": "فعال",
    "billing.free": "مفت",
    "billing.perMonth": "/ ماہ",
    "billing.starting": "Checkout شروع ہو رہا ہے...",
    "billing.current": "موجودہ پلان",
    "billing.useFree": "مفت پلان استعمال کریں",
    "billing.upgrade": "Stripe سے اپگریڈ کریں",
    "auth.loading": "آپ کے AI اسسٹنٹ کو تیار کیا جا رہا ہے...",
    "auth.email": "ای میل",
    "auth.password": "پاس ورڈ",
    "auth.name": "نام",
    "auth.otp": "او ٹی پی",
    "auth.newPassword": "نیا پاس ورڈ",
    "auth.forgotPassword": "پاس ورڈ بھول گئے؟",
    "auth.signUp": "سائن اپ",
    "auth.logIn": "لاگ اِن",
    "auth.alreadyAccount": "کیا آپ کے پاس پہلے سے اکاؤنٹ ہے؟",
    "auth.noAccount": "کیا آپ کا اکاؤنٹ نہیں ہے؟",
    "auth.backToLogin": "واپس لاگ اِن پر جائیں",
    "auth.createAccount": "اکاؤنٹ بنائیں",
    "auth.createAccountDescription":
      "چیٹنگ شروع کرنے کے لیے AI Assistant جوائن کریں۔",
    "auth.creatingAccount": "اکاؤنٹ بنایا جا رہا ہے...",
    "auth.welcomeBack": "خوش آمدید",
    "auth.loginDescription":
      "اپنے اکاؤنٹ تک رسائی کے لیے اپنی تفصیلات درج کریں۔",
    "auth.loggingIn": "لاگ اِن ہو رہا ہے...",
    "auth.verifyLoginOtp": "لاگ اِن OTP کی تصدیق کریں",
    "auth.otpDescription": "اپنی ای میل پر بھیجا گیا OTP درج کریں۔",
    "auth.verifying": "تصدیق ہو رہی ہے...",
    "auth.resetPassword": "پاس ورڈ ری سیٹ کریں",
    "auth.resetDescription":
      "اپنی ای میل درج کریں، ہم آپ کو ری سیٹ OTP بھیجیں گے۔",
    "auth.sendOtp": "OTP بھیجیں",
    "auth.sending": "بھیجا جا رہا ہے...",
    "auth.verifyResetOtp": "ری سیٹ OTP کی تصدیق کریں",
    "auth.createNewPassword": "نیا پاس ورڈ بنائیں",
    "auth.newPasswordDescription":
      "اپنے اکاؤنٹ کے لیے نیا پاس ورڈ منتخب کریں۔",
    "auth.updatePassword": "پاس ورڈ اپڈیٹ کریں",
    "auth.updating": "اپڈیٹ ہو رہا ہے...",
    "auth.logout": "لاگ آؤٹ",
    "dialog.deleteTitle": "رائٹنگ سیشن حذف کریں",
    "dialog.deleteDescription":
      "کیا آپ واقعی یہ رائٹنگ سیشن حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکتا اور تمام مواد مستقل طور پر حذف ہو جائے گا۔",
    "dialog.cancel": "منسوخ کریں",
    "dialog.deleteSession": "سیشن حذف کریں",
    "common.online": "آن لائن",
    "common.connectingChat": "چیٹ سے رابطہ قائم کیا جا رہا ہے...",
  },
  ar: {
    "settings.title": "الإعدادات",
    "settings.description":
      "قم بإدارة المظهر واللغة وتفضيلات البيانات لمساحة الكتابة الخاصة بك.",
    "settings.general": "عام",
    "settings.appearance": "المظهر",
    "settings.appearanceDescription": "اختر كيف يجب أن تبدو الواجهة.",
    "settings.language": "اللغة",
    "settings.languageDescription": "غيّر اللغة المستخدمة في واجهة الموقع.",
    "settings.dataControls": "عناصر التحكم بالبيانات",
    "settings.improveTitle": "حسّن النموذج للجميع",
    "settings.improveDescription":
      "اسمح باستخدام المحتوى الخاص بك لتدريب نماذجنا، مما يجعل ChatGPT أفضل لك وللجميع. نتخذ خطوات لحماية خصوصيتك.",
    "settings.learnMore": "اعرف المزيد",
    "theme.system": "النظام",
    "theme.dark": "داكن",
    "theme.light": "فاتح",
    "chat.newSession": "جلسة كتابة جديدة",
    "chat.sessions": "جلسات الكتابة",
    "chat.noSessionsTitle": "لا توجد جلسات كتابة بعد",
    "chat.noSessionsDescription":
      "ابدأ جلسة كتابة جديدة لبدء إنشاء المحتوى مع مساعدك الذكي.",
    "chat.noSessionsHint": "انقر على \"جلسة كتابة جديدة\" للبدء",
    "chat.heroTitle": "شريكك الذكي في الكتابة",
    "chat.heroDescription":
      "من المسودات الأولى إلى التعديلات النهائية، أنا هنا لمساعدتك على الكتابة بشكل أفضل وأسرع.",
    "chat.writeToday": "ماذا تريد أن تكتب اليوم؟",
    "chat.business": "الأعمال",
    "chat.content": "المحتوى",
    "chat.communication": "التواصل",
    "chat.creative": "إبداعي",
    "chat.prompt.business1":
      "اكتب رسالة بريد إلكتروني احترافية إلى مديري حول تحديث المشروع",
    "chat.prompt.business2":
      "اكتب منشور LinkedIn مؤثرًا عن إنجاز حديث",
    "chat.prompt.business3":
      "أنشئ ملخصًا تنفيذيًا لتقرير أعمال ربع سنوي",
    "chat.prompt.business4":
      "اكتب مقترحًا مقنعًا لحملة تسويقية جديدة",
    "chat.prompt.content1":
      "اكتب تدوينة عن الاتجاهات الناشئة في مجالي",
    "chat.prompt.content2":
      "أنشئ عبارات جذابة لوسائل التواصل الاجتماعي لإطلاق منتج",
    "chat.prompt.content3":
      "اكتب نشرة إخبارية تزيد من تفاعل العملاء",
    "chat.prompt.content4": "اكتب أوصافًا مقنعة للمنتجات تحقق التحويل",
    "chat.prompt.communication1":
      "أعد كتابة هذا النص ليكون أوضح وأكثر اختصارًا",
    "chat.prompt.communication2":
      "حسّن نبرة هذه الرسالة لتبدو أكثر احترافية",
    "chat.prompt.communication3":
      "أنشئ نص عرض تقديمي يحافظ على تفاعل الجمهور",
    "chat.prompt.communication4":
      "اكتب ردود خدمة عملاء تبني الثقة",
    "chat.prompt.creative1": "ابتكر حلولًا جديدة لمشكلة شائعة",
    "chat.prompt.creative2":
      "ولّد زوايا إبداعية لقصة أو مقال",
    "chat.prompt.creative3":
      "طوّر خلفيات للشخصيات في الكتابة الإبداعية",
    "chat.prompt.creative4":
      "أنشئ عناوين جذابة تلفت الانتباه",
    "chat.inputPlaceholder":
      "صف ما تريد كتابته، أو الصق نصًا لتحسينه...",
    "chat.pressEnter": "اضغط Enter للإرسال",
    "chat.shiftEnter": "Shift + Enter لسطر جديد",
    "chat.readyTitle": "جاهز للكتابة",
    "chat.readyDescription": "ابدأ المحادثة ولنصنع شيئًا رائعًا معًا.",
    "chat.brandSubtitle": "RH Writing AI • تم تدريبه بواسطة Rai Muhammad Haider",
    "chat.online": "RH-AI v1.0 • متصل",
    "billing.back": "العودة إلى مساحة العمل",
    "billing.title": "الخطط والفواتير",
    "billing.description":
      "اختر خطة الكتابة بالذكاء الاصطناعي المناسبة وأدر الوصول من مكان واحد.",
    "billing.currentPlan": "الخطة الحالية",
    "billing.verifying": "جار التحقق من Stripe وتفعيل خطتك...",
    "billing.popular": "الأكثر شيوعًا",
    "billing.active": "نشطة",
    "billing.free": "مجاني",
    "billing.perMonth": "/ شهر",
    "billing.starting": "جار بدء الدفع...",
    "billing.current": "الخطة الحالية",
    "billing.useFree": "استخدم الخطة المجانية",
    "billing.upgrade": "الترقية عبر Stripe",
    "auth.loading": "جار إعداد مساعدك الذكي...",
    "auth.email": "البريد الإلكتروني",
    "auth.password": "كلمة المرور",
    "auth.name": "الاسم",
    "auth.otp": "OTP",
    "auth.newPassword": "كلمة مرور جديدة",
    "auth.forgotPassword": "هل نسيت كلمة المرور؟",
    "auth.signUp": "إنشاء حساب",
    "auth.logIn": "تسجيل الدخول",
    "auth.alreadyAccount": "هل لديك حساب بالفعل؟",
    "auth.noAccount": "ليس لديك حساب؟",
    "auth.backToLogin": "العودة إلى تسجيل الدخول",
    "auth.createAccount": "إنشاء حساب",
    "auth.createAccountDescription": "انضم إلى AI Assistant لبدء المحادثة.",
    "auth.creatingAccount": "جار إنشاء الحساب...",
    "auth.welcomeBack": "مرحبًا بعودتك",
    "auth.loginDescription": "أدخل بياناتك للوصول إلى حسابك.",
    "auth.loggingIn": "جار تسجيل الدخول...",
    "auth.verifyLoginOtp": "تحقق من OTP لتسجيل الدخول",
    "auth.otpDescription": "أدخل OTP المرسل إلى بريدك الإلكتروني.",
    "auth.verifying": "جار التحقق...",
    "auth.resetPassword": "إعادة تعيين كلمة المرور",
    "auth.resetDescription":
      "أدخل بريدك الإلكتروني وسنرسل لك رمز OTP لإعادة التعيين.",
    "auth.sendOtp": "إرسال OTP",
    "auth.sending": "جار الإرسال...",
    "auth.verifyResetOtp": "تحقق من OTP لإعادة التعيين",
    "auth.createNewPassword": "إنشاء كلمة مرور جديدة",
    "auth.newPasswordDescription": "اختر كلمة مرور جديدة لحسابك.",
    "auth.updatePassword": "تحديث كلمة المرور",
    "auth.updating": "جار التحديث...",
    "auth.logout": "تسجيل الخروج",
    "dialog.deleteTitle": "حذف جلسة الكتابة",
    "dialog.deleteDescription":
      "هل أنت متأكد من رغبتك في حذف جلسة الكتابة هذه؟ لا يمكن التراجع عن هذا الإجراء وسيتم حذف كل المحتوى نهائيًا.",
    "dialog.cancel": "إلغاء",
    "dialog.deleteSession": "حذف الجلسة",
    "common.online": "متصل",
    "common.connectingChat": "جار الاتصال بالدردشة...",
  },
  es: {
    "settings.title": "Configuración",
    "settings.description":
      "Administra la apariencia, el idioma y las preferencias de datos de tu espacio de escritura.",
    "settings.general": "General",
    "settings.appearance": "Apariencia",
    "settings.appearanceDescription": "Elige cómo debe verse la interfaz.",
    "settings.language": "Idioma",
    "settings.languageDescription":
      "Cambia el idioma usado en la interfaz del sitio web.",
    "settings.dataControls": "Controles de datos",
    "settings.improveTitle": "Mejora el modelo para todos",
    "settings.improveDescription":
      "Permite que tu contenido se use para entrenar nuestros modelos, lo que mejora ChatGPT para ti y para todos. Tomamos medidas para proteger tu privacidad.",
    "settings.learnMore": "Más información",
    "theme.system": "Sistema",
    "theme.dark": "Oscuro",
    "theme.light": "Claro",
    "chat.newSession": "Nueva sesión de escritura",
    "chat.sessions": "Sesiones de escritura",
    "chat.noSessionsTitle": "Aún no hay sesiones de escritura",
    "chat.noSessionsDescription":
      "Inicia una nueva sesión de escritura para comenzar a crear contenido con tu asistente de IA.",
    "chat.noSessionsHint":
      "Haz clic en \"Nueva sesión de escritura\" para comenzar",
    "chat.heroTitle": "Tu compañero de escritura con IA",
    "chat.heroDescription":
      "Desde los primeros borradores hasta las ediciones finales, estoy aquí para ayudarte a escribir mejor y más rápido.",
    "chat.writeToday": "¿Qué te gustaría escribir hoy?",
    "chat.business": "Negocios",
    "chat.content": "Contenido",
    "chat.communication": "Comunicación",
    "chat.creative": "Creativo",
    "chat.prompt.business1":
      "Escribe un correo profesional a mi jefe sobre una actualización del proyecto",
    "chat.prompt.business2":
      "Redacta una publicación convincente de LinkedIn sobre un logro reciente",
    "chat.prompt.business3":
      "Crea un resumen ejecutivo para un informe empresarial trimestral",
    "chat.prompt.business4":
      "Escribe una propuesta persuasiva para una nueva campaña de marketing",
    "chat.prompt.content1":
      "Escribe una entrada de blog sobre tendencias emergentes en mi industria",
    "chat.prompt.content2":
      "Crea textos atractivos para redes sociales para el lanzamiento de un producto",
    "chat.prompt.content3":
      "Redacta un boletín que impulse la participación del cliente",
    "chat.prompt.content4":
      "Escribe descripciones de productos que conviertan",
    "chat.prompt.communication1":
      "Reescribe este texto para que sea más claro y conciso",
    "chat.prompt.communication2":
      "Mejora el tono de este mensaje para que suene más profesional",
    "chat.prompt.communication3":
      "Crea un guion de presentación que mantenga al público interesado",
    "chat.prompt.communication4":
      "Escribe respuestas de atención al cliente que generen confianza",
    "chat.prompt.creative1":
      "Piensa en soluciones innovadoras para un problema común",
    "chat.prompt.creative2":
      "Genera enfoques creativos para una historia o artículo",
    "chat.prompt.creative3":
      "Desarrolla historias de fondo para personajes de escritura creativa",
    "chat.prompt.creative4":
      "Crea titulares atractivos que llamen la atención",
    "chat.inputPlaceholder":
      "Describe lo que te gustaría escribir o pega texto para mejorarlo...",
    "chat.pressEnter": "Pulsa Enter para enviar",
    "chat.shiftEnter": "Shift + Enter para nueva línea",
    "chat.readyTitle": "Listo para escribir",
    "chat.readyDescription":
      "Comienza la conversación y creemos algo increíble juntos.",
    "chat.brandSubtitle": "RH Writing AI • Entrenado por Rai Muhammad Haider",
    "chat.online": "RH-AI v1.0 • En línea",
    "billing.back": "Volver al espacio de trabajo",
    "billing.title": "Planes y facturación",
    "billing.description":
      "Elige el plan de escritura con IA adecuado y gestiona el acceso desde un solo lugar.",
    "billing.currentPlan": "Plan actual",
    "billing.verifying":
      "Verificando Stripe y activando tu plan...",
    "billing.popular": "Popular",
    "billing.active": "Activo",
    "billing.free": "Gratis",
    "billing.perMonth": "/ mes",
    "billing.starting": "Iniciando pago...",
    "billing.current": "Plan actual",
    "billing.useFree": "Usar plan gratuito",
    "billing.upgrade": "Actualizar con Stripe",
    "auth.loading": "Preparando tu asistente de IA...",
    "auth.email": "Correo electrónico",
    "auth.password": "Contraseña",
    "auth.name": "Nombre",
    "auth.otp": "OTP",
    "auth.newPassword": "Nueva contraseña",
    "auth.forgotPassword": "¿Olvidaste tu contraseña?",
    "auth.signUp": "Registrarse",
    "auth.logIn": "Iniciar sesión",
    "auth.alreadyAccount": "¿Ya tienes una cuenta?",
    "auth.noAccount": "¿No tienes una cuenta?",
    "auth.backToLogin": "Volver al inicio de sesión",
    "auth.createAccount": "Crear una cuenta",
    "auth.createAccountDescription":
      "Únete a AI Assistant para empezar a chatear.",
    "auth.creatingAccount": "Creando cuenta...",
    "auth.welcomeBack": "Bienvenido de nuevo",
    "auth.loginDescription":
      "Introduce tus credenciales para acceder a tu cuenta.",
    "auth.loggingIn": "Iniciando sesión...",
    "auth.verifyLoginOtp": "Verificar OTP de inicio de sesión",
    "auth.otpDescription":
      "Introduce el OTP enviado a tu correo electrónico.",
    "auth.verifying": "Verificando...",
    "auth.resetPassword": "Restablecer contraseña",
    "auth.resetDescription":
      "Introduce tu correo y te enviaremos un OTP para restablecerla.",
    "auth.sendOtp": "Enviar OTP",
    "auth.sending": "Enviando...",
    "auth.verifyResetOtp": "Verificar OTP de restablecimiento",
    "auth.createNewPassword": "Crear nueva contraseña",
    "auth.newPasswordDescription":
      "Elige una nueva contraseña para tu cuenta.",
    "auth.updatePassword": "Actualizar contraseña",
    "auth.updating": "Actualizando...",
    "auth.logout": "Cerrar sesión",
    "dialog.deleteTitle": "Eliminar sesión de escritura",
    "dialog.deleteDescription":
      "¿Seguro que quieres eliminar esta sesión de escritura? Esta acción no se puede deshacer y todo el contenido se eliminará permanentemente.",
    "dialog.cancel": "Cancelar",
    "dialog.deleteSession": "Eliminar sesión",
    "common.online": "En línea",
    "common.connectingChat": "Conectando al chat...",
  },
  fr: {
    "settings.title": "Paramètres",
    "settings.description":
      "Gérez l'apparence, la langue et les préférences de données de votre espace d'écriture.",
    "settings.general": "Général",
    "settings.appearance": "Apparence",
    "settings.appearanceDescription":
      "Choisissez l'apparence de l'interface.",
    "settings.language": "Langue",
    "settings.languageDescription":
      "Modifiez la langue utilisée dans l'interface du site.",
    "settings.dataControls": "Contrôles des données",
    "settings.improveTitle": "Améliorer le modèle pour tout le monde",
    "settings.improveDescription":
      "Autorisez l'utilisation de votre contenu pour entraîner nos modèles, ce qui améliore ChatGPT pour vous et pour tous. Nous prenons des mesures pour protéger votre vie privée.",
    "settings.learnMore": "En savoir plus",
    "theme.system": "Système",
    "theme.dark": "Sombre",
    "theme.light": "Clair",
    "chat.newSession": "Nouvelle session d'écriture",
    "chat.sessions": "Sessions d'écriture",
    "chat.noSessionsTitle": "Aucune session d'écriture pour le moment",
    "chat.noSessionsDescription":
      "Commencez une nouvelle session d'écriture pour créer du contenu avec votre assistant IA.",
    "chat.noSessionsHint":
      "Cliquez sur « Nouvelle session d'écriture » pour commencer",
    "chat.heroTitle": "Votre partenaire d'écriture IA",
    "chat.heroDescription":
      "Des premiers brouillons aux retouches finales, je suis là pour vous aider à mieux écrire, plus vite.",
    "chat.writeToday": "Que voulez-vous écrire aujourd'hui ?",
    "chat.business": "Affaires",
    "chat.content": "Contenu",
    "chat.communication": "Communication",
    "chat.creative": "Créatif",
    "chat.prompt.business1":
      "Rédigez un e-mail professionnel à mon responsable au sujet d'une mise à jour de projet",
    "chat.prompt.business2":
      "Rédigez une publication LinkedIn convaincante sur une réussite récente",
    "chat.prompt.business3":
      "Créez un résumé exécutif pour un rapport trimestriel",
    "chat.prompt.business4":
      "Rédigez une proposition persuasive pour une nouvelle campagne marketing",
    "chat.prompt.content1":
      "Rédigez un article de blog sur les tendances émergentes de mon secteur",
    "chat.prompt.content2":
      "Créez des textes engageants pour un lancement de produit sur les réseaux sociaux",
    "chat.prompt.content3":
      "Rédigez une newsletter qui augmente l'engagement client",
    "chat.prompt.content4":
      "Rédigez des descriptions de produits qui convertissent",
    "chat.prompt.communication1":
      "Réécrivez ce texte pour qu'il soit plus clair et concis",
    "chat.prompt.communication2":
      "Améliorez le ton de ce message pour qu'il paraisse plus professionnel",
    "chat.prompt.communication3":
      "Créez un script de présentation qui maintient l'attention du public",
    "chat.prompt.communication4":
      "Rédigez des réponses de service client qui inspirent confiance",
    "chat.prompt.creative1":
      "Imaginez des solutions innovantes à un problème courant",
    "chat.prompt.creative2":
      "Générez des angles créatifs pour une histoire ou un article",
    "chat.prompt.creative3":
      "Développez des histoires de fond pour des personnages",
    "chat.prompt.creative4":
      "Créez des titres accrocheurs qui attirent l'attention",
    "chat.inputPlaceholder":
      "Décrivez ce que vous souhaitez écrire ou collez un texte à améliorer...",
    "chat.pressEnter": "Appuyez sur Entrée pour envoyer",
    "chat.shiftEnter": "Shift + Entrée pour une nouvelle ligne",
    "chat.readyTitle": "Prêt à écrire",
    "chat.readyDescription":
      "Commencez la conversation et créons ensemble quelque chose d'extraordinaire.",
    "chat.brandSubtitle": "RH Writing AI • Entraîné par Rai Muhammad Haider",
    "chat.online": "RH-AI v1.0 • En ligne",
    "billing.back": "Retour à l'espace de travail",
    "billing.title": "Forfaits et facturation",
    "billing.description":
      "Choisissez le bon forfait d'écriture IA et gérez l'accès depuis un seul endroit.",
    "billing.currentPlan": "Forfait actuel",
    "billing.verifying":
      "Vérification de Stripe et activation de votre forfait...",
    "billing.popular": "Populaire",
    "billing.active": "Actif",
    "billing.free": "Gratuit",
    "billing.perMonth": "/ mois",
    "billing.starting": "Démarrage du paiement...",
    "billing.current": "Forfait actuel",
    "billing.useFree": "Utiliser le forfait gratuit",
    "billing.upgrade": "Passer à Stripe",
    "auth.loading": "Configuration de votre assistant IA...",
    "auth.email": "E-mail",
    "auth.password": "Mot de passe",
    "auth.name": "Nom",
    "auth.otp": "OTP",
    "auth.newPassword": "Nouveau mot de passe",
    "auth.forgotPassword": "Mot de passe oublié ?",
    "auth.signUp": "S'inscrire",
    "auth.logIn": "Se connecter",
    "auth.alreadyAccount": "Vous avez déjà un compte ?",
    "auth.noAccount": "Vous n'avez pas de compte ?",
    "auth.backToLogin": "Retour à la connexion",
    "auth.createAccount": "Créer un compte",
    "auth.createAccountDescription":
      "Rejoignez AI Assistant pour commencer à discuter.",
    "auth.creatingAccount": "Création du compte...",
    "auth.welcomeBack": "Bon retour",
    "auth.loginDescription":
      "Entrez vos identifiants pour accéder à votre compte.",
    "auth.loggingIn": "Connexion...",
    "auth.verifyLoginOtp": "Vérifier l'OTP de connexion",
    "auth.otpDescription": "Entrez l'OTP envoyé à votre e-mail.",
    "auth.verifying": "Vérification...",
    "auth.resetPassword": "Réinitialiser le mot de passe",
    "auth.resetDescription":
      "Entrez votre e-mail et nous vous enverrons un OTP de réinitialisation.",
    "auth.sendOtp": "Envoyer l'OTP",
    "auth.sending": "Envoi...",
    "auth.verifyResetOtp": "Vérifier l'OTP de réinitialisation",
    "auth.createNewPassword": "Créer un nouveau mot de passe",
    "auth.newPasswordDescription":
      "Choisissez un nouveau mot de passe pour votre compte.",
    "auth.updatePassword": "Mettre à jour le mot de passe",
    "auth.updating": "Mise à jour...",
    "auth.logout": "Se déconnecter",
    "dialog.deleteTitle": "Supprimer la session d'écriture",
    "dialog.deleteDescription":
      "Voulez-vous vraiment supprimer cette session d'écriture ? Cette action est irréversible et tout le contenu sera supprimé définitivement.",
    "dialog.cancel": "Annuler",
    "dialog.deleteSession": "Supprimer la session",
    "common.online": "En ligne",
    "common.connectingChat": "Connexion au chat...",
  },
  de: {
    "settings.title": "Einstellungen",
    "settings.description":
      "Verwalte Erscheinungsbild, Sprache und Datenpräferenzen für deinen Schreibbereich.",
    "settings.general": "Allgemein",
    "settings.appearance": "Darstellung",
    "settings.appearanceDescription":
      "Wähle aus, wie die Oberfläche aussehen soll.",
    "settings.language": "Sprache",
    "settings.languageDescription":
      "Ändere die Sprache der Website-Oberfläche.",
    "settings.dataControls": "Datenkontrollen",
    "settings.improveTitle": "Das Modell für alle verbessern",
    "settings.improveDescription":
      "Erlaube, dass deine Inhalte zum Trainieren unserer Modelle verwendet werden. Dadurch wird ChatGPT für dich und alle anderen besser. Wir treffen Maßnahmen zum Schutz deiner Privatsphäre.",
    "settings.learnMore": "Mehr erfahren",
    "theme.system": "System",
    "theme.dark": "Dunkel",
    "theme.light": "Hell",
    "chat.newSession": "Neue Schreibsitzung",
    "chat.sessions": "Schreibsitzungen",
    "chat.noSessionsTitle": "Noch keine Schreibsitzungen",
    "chat.noSessionsDescription":
      "Starte eine neue Schreibsitzung, um Inhalte mit deinem KI-Assistenten zu erstellen.",
    "chat.noSessionsHint":
      "Klicke auf „Neue Schreibsitzung“, um loszulegen",
    "chat.heroTitle": "Dein KI-Schreibpartner",
    "chat.heroDescription":
      "Vom ersten Entwurf bis zur finalen Überarbeitung helfe ich dir, besser und schneller zu schreiben.",
    "chat.writeToday": "Was möchtest du heute schreiben?",
    "chat.business": "Business",
    "chat.content": "Inhalt",
    "chat.communication": "Kommunikation",
    "chat.creative": "Kreativ",
    "chat.prompt.business1":
      "Schreibe eine professionelle E-Mail an meinen Chef über ein Projektupdate",
    "chat.prompt.business2":
      "Verfasse einen überzeugenden LinkedIn-Beitrag über einen aktuellen Erfolg",
    "chat.prompt.business3":
      "Erstelle eine Management-Zusammenfassung für einen Quartalsbericht",
    "chat.prompt.business4":
      "Schreibe einen überzeugenden Vorschlag für eine neue Marketingkampagne",
    "chat.prompt.content1":
      "Schreibe einen Blogbeitrag über neue Trends in meiner Branche",
    "chat.prompt.content2":
      "Erstelle ansprechende Social-Media-Texte für einen Produktlaunch",
    "chat.prompt.content3":
      "Verfasse einen Newsletter, der die Kundenbindung steigert",
    "chat.prompt.content4":
      "Schreibe überzeugende Produktbeschreibungen, die konvertieren",
    "chat.prompt.communication1":
      "Formuliere diesen Text klarer und prägnanter um",
    "chat.prompt.communication2":
      "Verbessere den Ton dieser Nachricht, damit sie professioneller wirkt",
    "chat.prompt.communication3":
      "Erstelle ein Präsentationsskript, das das Publikum fesselt",
    "chat.prompt.communication4":
      "Schreibe Kundenservice-Antworten, die Vertrauen schaffen",
    "chat.prompt.creative1":
      "Entwickle innovative Lösungen für ein häufiges Problem",
    "chat.prompt.creative2":
      "Generiere kreative Blickwinkel für eine Geschichte oder einen Artikel",
    "chat.prompt.creative3":
      "Entwickle Hintergrundgeschichten für kreatives Schreiben",
    "chat.prompt.creative4":
      "Erstelle überzeugende Überschriften, die Aufmerksamkeit erzeugen",
    "chat.inputPlaceholder":
      "Beschreibe, was du schreiben möchtest, oder füge Text zum Verbessern ein...",
    "chat.pressEnter": "Zum Senden Enter drücken",
    "chat.shiftEnter": "Shift + Enter für neue Zeile",
    "chat.readyTitle": "Bereit zum Schreiben",
    "chat.readyDescription":
      "Starte das Gespräch und lass uns gemeinsam etwas Großartiges schaffen.",
    "chat.brandSubtitle": "RH Writing AI • Trainiert von Rai Muhammad Haider",
    "chat.online": "RH-AI v1.0 • Online",
    "billing.back": "Zurück zum Arbeitsbereich",
    "billing.title": "Pläne und Abrechnung",
    "billing.description":
      "Wähle den passenden KI-Schreibplan und verwalte den Zugriff an einem Ort.",
    "billing.currentPlan": "Aktueller Plan",
    "billing.verifying":
      "Stripe wird überprüft und dein Plan wird aktiviert...",
    "billing.popular": "Beliebt",
    "billing.active": "Aktiv",
    "billing.free": "Kostenlos",
    "billing.perMonth": "/ Monat",
    "billing.starting": "Checkout wird gestartet...",
    "billing.current": "Aktueller Plan",
    "billing.useFree": "Kostenlosen Plan verwenden",
    "billing.upgrade": "Mit Stripe upgraden",
    "auth.loading": "Dein KI-Assistent wird vorbereitet...",
    "auth.email": "E-Mail",
    "auth.password": "Passwort",
    "auth.name": "Name",
    "auth.otp": "OTP",
    "auth.newPassword": "Neues Passwort",
    "auth.forgotPassword": "Passwort vergessen?",
    "auth.signUp": "Registrieren",
    "auth.logIn": "Anmelden",
    "auth.alreadyAccount": "Hast du bereits ein Konto?",
    "auth.noAccount": "Hast du noch kein Konto?",
    "auth.backToLogin": "Zurück zur Anmeldung",
    "auth.createAccount": "Konto erstellen",
    "auth.createAccountDescription":
      "Tritt AI Assistant bei, um mit dem Chatten zu beginnen.",
    "auth.creatingAccount": "Konto wird erstellt...",
    "auth.welcomeBack": "Willkommen zurück",
    "auth.loginDescription":
      "Gib deine Zugangsdaten ein, um auf dein Konto zuzugreifen.",
    "auth.loggingIn": "Anmeldung läuft...",
    "auth.verifyLoginOtp": "Login-OTP bestätigen",
    "auth.otpDescription": "Gib das an deine E-Mail gesendete OTP ein.",
    "auth.verifying": "Wird überprüft...",
    "auth.resetPassword": "Passwort zurücksetzen",
    "auth.resetDescription":
      "Gib deine E-Mail ein, dann senden wir dir ein Reset-OTP.",
    "auth.sendOtp": "OTP senden",
    "auth.sending": "Wird gesendet...",
    "auth.verifyResetOtp": "Reset-OTP bestätigen",
    "auth.createNewPassword": "Neues Passwort erstellen",
    "auth.newPasswordDescription":
      "Wähle ein neues Passwort für dein Konto.",
    "auth.updatePassword": "Passwort aktualisieren",
    "auth.updating": "Wird aktualisiert...",
    "auth.logout": "Abmelden",
    "dialog.deleteTitle": "Schreibsitzung löschen",
    "dialog.deleteDescription":
      "Möchtest du diese Schreibsitzung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden und alle Inhalte werden dauerhaft entfernt.",
    "dialog.cancel": "Abbrechen",
    "dialog.deleteSession": "Sitzung löschen",
    "common.online": "Online",
    "common.connectingChat": "Verbindung zum Chat wird hergestellt...",
  },
  hi: {
    "settings.title": "सेटिंग्स",
    "settings.description":
      "अपने राइटिंग वर्कस्पेस की रूपरेखा, भाषा और डेटा प्राथमिकताएं प्रबंधित करें।",
    "settings.general": "सामान्य",
    "settings.appearance": "दिखावट",
    "settings.appearanceDescription":
      "चुनें कि इंटरफ़ेस कैसा दिखना चाहिए।",
    "settings.language": "भाषा",
    "settings.languageDescription":
      "वेबसाइट इंटरफ़ेस में उपयोग की जाने वाली भाषा बदलें।",
    "settings.dataControls": "डेटा नियंत्रण",
    "settings.improveTitle": "सभी के लिए मॉडल बेहतर बनाएं",
    "settings.improveDescription":
      "अपने कंटेंट को हमारे मॉडलों को प्रशिक्षित करने के लिए उपयोग करने दें, जिससे ChatGPT आपके लिए और सभी के लिए बेहतर बनता है। हम आपकी गोपनीयता की सुरक्षा के लिए कदम उठाते हैं।",
    "settings.learnMore": "और जानें",
    "theme.system": "सिस्टम",
    "theme.dark": "डार्क",
    "theme.light": "लाइट",
    "chat.newSession": "नया राइटिंग सेशन",
    "chat.sessions": "राइटिंग सेशंस",
    "chat.noSessionsTitle": "अभी तक कोई राइटिंग सेशन नहीं",
    "chat.noSessionsDescription":
      "अपने AI असिस्टेंट के साथ कंटेंट बनाना शुरू करने के लिए नया राइटिंग सेशन शुरू करें।",
    "chat.noSessionsHint":
      "\"नया राइटिंग सेशन\" पर क्लिक करके शुरू करें",
    "chat.heroTitle": "आपका AI राइटिंग पार्टनर",
    "chat.heroDescription":
      "पहले ड्राफ्ट से अंतिम एडिट तक, मैं आपको बेहतर और तेज़ लिखने में मदद करने के लिए यहां हूं।",
    "chat.writeToday": "आज आप क्या लिखना चाहते हैं?",
    "chat.business": "बिज़नेस",
    "chat.content": "कंटेंट",
    "chat.communication": "कम्युनिकेशन",
    "chat.creative": "क्रिएटिव",
    "chat.prompt.business1":
      "अपने बॉस को प्रोजेक्ट अपडेट के बारे में एक प्रोफेशनल ईमेल लिखें",
    "chat.prompt.business2":
      "हाल की उपलब्धि पर एक प्रभावशाली LinkedIn पोस्ट तैयार करें",
    "chat.prompt.business3":
      "तिमाही बिज़नेस रिपोर्ट के लिए एक एग्जीक्यूटिव सारांश बनाएं",
    "chat.prompt.business4":
      "नई मार्केटिंग कैंपेन के लिए प्रभावशाली प्रस्ताव लिखें",
    "chat.prompt.content1":
      "मेरे उद्योग के उभरते रुझानों पर एक ब्लॉग पोस्ट लिखें",
    "chat.prompt.content2":
      "प्रोडक्ट लॉन्च के लिए आकर्षक सोशल मीडिया कैप्शन बनाएं",
    "chat.prompt.content3":
      "ऐसा न्यूज़लेटर लिखें जो ग्राहक सहभागिता बढ़ाए",
    "chat.prompt.content4":
      "ऐसे प्रोडक्ट विवरण लिखें जो कन्वर्ट करें",
    "chat.prompt.communication1":
      "इस टेक्स्ट को अधिक स्पष्ट और संक्षिप्त बनाकर फिर से लिखें",
    "chat.prompt.communication2":
      "इस संदेश का टोन अधिक प्रोफेशनल बनाएं",
    "chat.prompt.communication3":
      "ऐसा प्रेज़ेंटेशन स्क्रिप्ट बनाएं जो दर्शकों को जोड़े रखे",
    "chat.prompt.communication4":
      "ऐसे कस्टमर सर्विस जवाब लिखें जो भरोसा बनाएं",
    "chat.prompt.creative1":
      "किसी सामान्य समस्या के लिए नवाचारी समाधान सोचें",
    "chat.prompt.creative2":
      "कहानी या लेख के लिए रचनात्मक एंगल तैयार करें",
    "chat.prompt.creative3":
      "रचनात्मक लेखन के लिए पात्रों की पृष्ठभूमि विकसित करें",
    "chat.prompt.creative4":
      "ऐसी हेडलाइन बनाएं जो तुरंत ध्यान खींचें",
    "chat.inputPlaceholder":
      "बताएं कि आप क्या लिखना चाहते हैं, या सुधार के लिए टेक्स्ट पेस्ट करें...",
    "chat.pressEnter": "भेजने के लिए Enter दबाएं",
    "chat.shiftEnter": "नई लाइन के लिए Shift + Enter",
    "chat.readyTitle": "लिखने के लिए तैयार",
    "chat.readyDescription":
      "बातचीत शुरू करें और मिलकर कुछ शानदार बनाएं।",
    "chat.brandSubtitle": "RH Writing AI • Rai Muhammad Haider द्वारा प्रशिक्षित",
    "chat.online": "RH-AI v1.0 • ऑनलाइन",
    "billing.back": "वर्कस्पेस पर वापस जाएं",
    "billing.title": "प्लान और बिलिंग",
    "billing.description":
      "सही AI राइटिंग प्लान चुनें और एक ही जगह से एक्सेस मैनेज करें।",
    "billing.currentPlan": "वर्तमान प्लान",
    "billing.verifying":
      "Stripe चेकआउट सत्यापित किया जा रहा है और आपका प्लान सक्रिय किया जा रहा है...",
    "billing.popular": "लोकप्रिय",
    "billing.active": "सक्रिय",
    "billing.free": "मुफ़्त",
    "billing.perMonth": "/ महीना",
    "billing.starting": "चेकआउट शुरू हो रहा है...",
    "billing.current": "वर्तमान प्लान",
    "billing.useFree": "मुफ़्त प्लान उपयोग करें",
    "billing.upgrade": "Stripe के साथ अपग्रेड करें",
    "auth.loading": "आपका AI असिस्टेंट तैयार किया जा रहा है...",
    "auth.email": "ईमेल",
    "auth.password": "पासवर्ड",
    "auth.name": "नाम",
    "auth.otp": "OTP",
    "auth.newPassword": "नया पासवर्ड",
    "auth.forgotPassword": "पासवर्ड भूल गए?",
    "auth.signUp": "साइन अप",
    "auth.logIn": "लॉग इन",
    "auth.alreadyAccount": "क्या आपका पहले से अकाउंट है?",
    "auth.noAccount": "क्या आपका अकाउंट नहीं है?",
    "auth.backToLogin": "लॉग इन पर वापस जाएं",
    "auth.createAccount": "अकाउंट बनाएं",
    "auth.createAccountDescription":
      "चैटिंग शुरू करने के लिए AI Assistant जॉइन करें।",
    "auth.creatingAccount": "अकाउंट बनाया जा रहा है...",
    "auth.welcomeBack": "वापसी पर स्वागत है",
    "auth.loginDescription":
      "अपने अकाउंट तक पहुंचने के लिए अपनी जानकारी दर्ज करें।",
    "auth.loggingIn": "लॉग इन हो रहा है...",
    "auth.verifyLoginOtp": "लॉग इन OTP सत्यापित करें",
    "auth.otpDescription": "अपने ईमेल पर भेजा गया OTP दर्ज करें।",
    "auth.verifying": "सत्यापित किया जा रहा है...",
    "auth.resetPassword": "पासवर्ड रीसेट करें",
    "auth.resetDescription":
      "अपना ईमेल दर्ज करें, हम आपको रीसेट OTP भेजेंगे।",
    "auth.sendOtp": "OTP भेजें",
    "auth.sending": "भेजा जा रहा है...",
    "auth.verifyResetOtp": "रीसेट OTP सत्यापित करें",
    "auth.createNewPassword": "नया पासवर्ड बनाएं",
    "auth.newPasswordDescription":
      "अपने अकाउंट के लिए नया पासवर्ड चुनें।",
    "auth.updatePassword": "पासवर्ड अपडेट करें",
    "auth.updating": "अपडेट किया जा रहा है...",
    "auth.logout": "लॉग आउट",
    "dialog.deleteTitle": "राइटिंग सेशन हटाएं",
    "dialog.deleteDescription":
      "क्या आप वाकई इस राइटिंग सेशन को हटाना चाहते हैं? यह कार्रवाई वापस नहीं ली जा सकती और सारा कंटेंट स्थायी रूप से हट जाएगा।",
    "dialog.cancel": "रद्द करें",
    "dialog.deleteSession": "सेशन हटाएं",
    "common.online": "ऑनलाइन",
    "common.connectingChat": "चैट से कनेक्ट किया जा रहा है...",
  },
  tr: {
    "settings.title": "Ayarlar",
    "settings.description":
      "Yazma çalışma alanınız için görünüm, dil ve veri tercihlerini yönetin.",
    "settings.general": "Genel",
    "settings.appearance": "Görünüm",
    "settings.appearanceDescription":
      "Arayüzün nasıl görünmesi gerektiğini seçin.",
    "settings.language": "Dil",
    "settings.languageDescription":
      "Web sitesi arayüzünde kullanılan dili değiştirin.",
    "settings.dataControls": "Veri kontrolleri",
    "settings.improveTitle": "Modeli herkes için iyileştir",
    "settings.improveDescription":
      "İçeriğinizin modellerimizi eğitmek için kullanılmasına izin verin. Bu, ChatGPT'yi sizin ve herkes için daha iyi hale getirir. Gizliliğinizi korumak için adımlar atıyoruz.",
    "settings.learnMore": "Daha fazla bilgi",
    "theme.system": "Sistem",
    "theme.dark": "Koyu",
    "theme.light": "Açık",
    "chat.newSession": "Yeni yazma oturumu",
    "chat.sessions": "Yazma oturumları",
    "chat.noSessionsTitle": "Henüz yazma oturumu yok",
    "chat.noSessionsDescription":
      "Yapay zeka asistanınızla içerik oluşturmaya başlamak için yeni bir yazma oturumu başlatın.",
    "chat.noSessionsHint":
      "Başlamak için \"Yeni yazma oturumu\"na tıklayın",
    "chat.heroTitle": "Yapay Zeka Yazı Partneriniz",
    "chat.heroDescription":
      "İlk taslaklardan son düzenlemelere kadar daha iyi ve daha hızlı yazmanıza yardımcı olmak için buradayım.",
    "chat.writeToday": "Bugün ne yazmak istersiniz?",
    "chat.business": "İş",
    "chat.content": "İçerik",
    "chat.communication": "İletişim",
    "chat.creative": "Yaratıcı",
    "chat.prompt.business1":
      "Yöneticime proje güncellemesi hakkında profesyonel bir e-posta yaz",
    "chat.prompt.business2":
      "Yakın zamanda elde edilen bir başarı hakkında etkileyici bir LinkedIn gönderisi hazırla",
    "chat.prompt.business3":
      "Üç aylık iş raporu için yönetici özeti oluştur",
    "chat.prompt.business4":
      "Yeni bir pazarlama kampanyası için ikna edici bir teklif yaz",
    "chat.prompt.content1":
      "Sektörümdeki yükselen trendler hakkında blog yazısı yaz",
    "chat.prompt.content2":
      "Ürün lansmanı için ilgi çekici sosyal medya metinleri oluştur",
    "chat.prompt.content3":
      "Müşteri etkileşimini artıran bir bülten hazırla",
    "chat.prompt.content4":
      "Dönüşüm sağlayan ürün açıklamaları yaz",
    "chat.prompt.communication1":
      "Bu metni daha açık ve öz olacak şekilde yeniden yaz",
    "chat.prompt.communication2":
      "Bu mesajın tonunu daha profesyonel hale getir",
    "chat.prompt.communication3":
      "İzleyiciyi bağlı tutan bir sunum metni oluştur",
    "chat.prompt.communication4":
      "Güven oluşturan müşteri hizmetleri yanıtları yaz",
    "chat.prompt.creative1":
      "Yaygın bir problem için yenilikçi çözümler üret",
    "chat.prompt.creative2":
      "Bir hikâye veya makale için yaratıcı açılar üret",
    "chat.prompt.creative3":
      "Yaratıcı yazım için karakter arka planları geliştir",
    "chat.prompt.creative4":
      "Dikkat çeken başlıklar oluştur",
    "chat.inputPlaceholder":
      "Ne yazmak istediğinizi açıklayın veya geliştirmek için metin yapıştırın...",
    "chat.pressEnter": "Göndermek için Enter'a basın",
    "chat.shiftEnter": "Yeni satır için Shift + Enter",
    "chat.readyTitle": "Yazmaya hazır",
    "chat.readyDescription":
      "Konuşmayı başlatın ve birlikte harika bir şey oluşturalım.",
    "chat.brandSubtitle": "RH Writing AI • Rai Muhammad Haider tarafından eğitildi",
    "chat.online": "RH-AI v1.0 • Çevrimiçi",
    "billing.back": "Çalışma alanına dön",
    "billing.title": "Planlar ve faturalandırma",
    "billing.description":
      "Doğru yapay zeka yazım planını seçin ve erişimi tek yerden yönetin.",
    "billing.currentPlan": "Mevcut plan",
    "billing.verifying":
      "Stripe doğrulanıyor ve planınız etkinleştiriliyor...",
    "billing.popular": "Popüler",
    "billing.active": "Etkin",
    "billing.free": "Ücretsiz",
    "billing.perMonth": "/ ay",
    "billing.starting": "Ödeme başlatılıyor...",
    "billing.current": "Mevcut plan",
    "billing.useFree": "Ücretsiz planı kullan",
    "billing.upgrade": "Stripe ile yükselt",
    "auth.loading": "Yapay zeka asistanınız hazırlanıyor...",
    "auth.email": "E-posta",
    "auth.password": "Şifre",
    "auth.name": "Ad",
    "auth.otp": "OTP",
    "auth.newPassword": "Yeni şifre",
    "auth.forgotPassword": "Şifrenizi mi unuttunuz?",
    "auth.signUp": "Kayıt ol",
    "auth.logIn": "Giriş yap",
    "auth.alreadyAccount": "Zaten hesabınız var mı?",
    "auth.noAccount": "Hesabınız yok mu?",
    "auth.backToLogin": "Girişe dön",
    "auth.createAccount": "Hesap oluştur",
    "auth.createAccountDescription":
      "Sohbete başlamak için AI Assistant'a katılın.",
    "auth.creatingAccount": "Hesap oluşturuluyor...",
    "auth.welcomeBack": "Tekrar hoş geldiniz",
    "auth.loginDescription":
      "Hesabınıza erişmek için bilgilerinizi girin.",
    "auth.loggingIn": "Giriş yapılıyor...",
    "auth.verifyLoginOtp": "Giriş OTP'sini doğrula",
    "auth.otpDescription":
      "E-postanıza gönderilen OTP'yi girin.",
    "auth.verifying": "Doğrulanıyor...",
    "auth.resetPassword": "Şifreyi sıfırla",
    "auth.resetDescription":
      "E-postanızı girin, size sıfırlama OTP'si gönderelim.",
    "auth.sendOtp": "OTP gönder",
    "auth.sending": "Gönderiliyor...",
    "auth.verifyResetOtp": "Sıfırlama OTP'sini doğrula",
    "auth.createNewPassword": "Yeni şifre oluştur",
    "auth.newPasswordDescription":
      "Hesabınız için yeni bir şifre seçin.",
    "auth.updatePassword": "Şifreyi güncelle",
    "auth.updating": "Güncelleniyor...",
    "auth.logout": "Çıkış yap",
    "dialog.deleteTitle": "Yazma oturumunu sil",
    "dialog.deleteDescription":
      "Bu yazma oturumunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm içerik kalıcı olarak silinir.",
    "dialog.cancel": "İptal",
    "dialog.deleteSession": "Oturumu sil",
    "common.online": "Çevrimiçi",
    "common.connectingChat": "Sohbete bağlanılıyor...",
  },
  "zh-CN": {
    "settings.title": "设置",
    "settings.description":
      "管理你的写作工作区的外观、语言和数据偏好设置。",
    "settings.general": "常规",
    "settings.appearance": "外观",
    "settings.appearanceDescription": "选择界面的显示方式。",
    "settings.language": "语言",
    "settings.languageDescription": "更改网站界面所使用的语言。",
    "settings.dataControls": "数据控制",
    "settings.improveTitle": "帮助所有人改进模型",
    "settings.improveDescription":
      "允许将你的内容用于训练我们的模型，这将让 ChatGPT 对你和所有人都更好。我们会采取措施保护你的隐私。",
    "settings.learnMore": "了解更多",
    "theme.system": "跟随系统",
    "theme.dark": "深色",
    "theme.light": "浅色",
    "chat.newSession": "新写作会话",
    "chat.sessions": "写作会话",
    "chat.noSessionsTitle": "还没有写作会话",
    "chat.noSessionsDescription":
      "开始一个新的写作会话，与 AI 助手一起创作内容。",
    "chat.noSessionsHint": "点击“新写作会话”开始",
    "chat.heroTitle": "你的 AI 写作伙伴",
    "chat.heroDescription":
      "从初稿到最终润色，我都会帮助你写得更好、更快。",
    "chat.writeToday": "你今天想写些什么？",
    "chat.business": "商务",
    "chat.content": "内容",
    "chat.communication": "沟通",
    "chat.creative": "创意",
    "chat.prompt.business1":
      "写一封关于项目进展的专业邮件给我的老板",
    "chat.prompt.business2":
      "起草一篇关于最近成就的有吸引力的 LinkedIn 帖子",
    "chat.prompt.business3":
      "为季度业务报告创建执行摘要",
    "chat.prompt.business4":
      "为新的营销活动撰写有说服力的提案",
    "chat.prompt.content1":
      "撰写一篇关于我所在行业新兴趋势的博客文章",
    "chat.prompt.content2":
      "为产品发布创建吸引人的社交媒体文案",
    "chat.prompt.content3":
      "起草一份能够提升客户参与度的新闻简报",
    "chat.prompt.content4":
      "撰写能够促进转化的产品描述",
    "chat.prompt.communication1":
      "将这段文字改写得更清晰、更简洁",
    "chat.prompt.communication2":
      "改进这条消息的语气，使其更专业",
    "chat.prompt.communication3":
      "创建一份能持续吸引观众的演示稿",
    "chat.prompt.communication4":
      "撰写能够建立信任的客户服务回复",
    "chat.prompt.creative1":
      "为常见问题头脑风暴创新解决方案",
    "chat.prompt.creative2":
      "为故事或文章生成创意角度",
    "chat.prompt.creative3":
      "为创意写作中的角色设计背景故事",
    "chat.prompt.creative4":
      "创建能够吸引注意力的标题",
    "chat.inputPlaceholder":
      "描述你想写的内容，或粘贴文本进行优化...",
    "chat.pressEnter": "按 Enter 发送",
    "chat.shiftEnter": "Shift + Enter 换行",
    "chat.readyTitle": "准备写作",
    "chat.readyDescription": "开始对话，让我们一起创作精彩内容。",
    "chat.brandSubtitle": "RH Writing AI • 由 Rai Muhammad Haider 训练",
    "chat.online": "RH-AI v1.0 • 在线",
    "billing.back": "返回工作区",
    "billing.title": "套餐与账单",
    "billing.description":
      "选择合适的 AI 写作套餐，并在一个地方管理访问权限。",
    "billing.currentPlan": "当前套餐",
    "billing.verifying": "正在验证 Stripe 并激活你的套餐...",
    "billing.popular": "热门",
    "billing.active": "已激活",
    "billing.free": "免费",
    "billing.perMonth": "/ 月",
    "billing.starting": "正在启动结账...",
    "billing.current": "当前套餐",
    "billing.useFree": "使用免费套餐",
    "billing.upgrade": "使用 Stripe 升级",
    "auth.loading": "正在设置你的 AI 助手...",
    "auth.email": "电子邮件",
    "auth.password": "密码",
    "auth.name": "姓名",
    "auth.otp": "OTP",
    "auth.newPassword": "新密码",
    "auth.forgotPassword": "忘记密码？",
    "auth.signUp": "注册",
    "auth.logIn": "登录",
    "auth.alreadyAccount": "已经有账户？",
    "auth.noAccount": "还没有账户？",
    "auth.backToLogin": "返回登录",
    "auth.createAccount": "创建账户",
    "auth.createAccountDescription": "加入 AI Assistant 开始聊天。",
    "auth.creatingAccount": "正在创建账户...",
    "auth.welcomeBack": "欢迎回来",
    "auth.loginDescription": "输入你的凭据以访问账户。",
    "auth.loggingIn": "正在登录...",
    "auth.verifyLoginOtp": "验证登录 OTP",
    "auth.otpDescription": "输入发送到你邮箱的 OTP。",
    "auth.verifying": "正在验证...",
    "auth.resetPassword": "重置密码",
    "auth.resetDescription":
      "输入你的邮箱，我们会向你发送重置 OTP。",
    "auth.sendOtp": "发送 OTP",
    "auth.sending": "正在发送...",
    "auth.verifyResetOtp": "验证重置 OTP",
    "auth.createNewPassword": "创建新密码",
    "auth.newPasswordDescription": "为你的账户选择一个新密码。",
    "auth.updatePassword": "更新密码",
    "auth.updating": "正在更新...",
    "auth.logout": "退出登录",
    "dialog.deleteTitle": "删除写作会话",
    "dialog.deleteDescription":
      "你确定要删除此写作会话吗？此操作无法撤销，所有内容都将被永久删除。",
    "dialog.cancel": "取消",
    "dialog.deleteSession": "删除会话",
    "common.online": "在线",
    "common.connectingChat": "正在连接聊天...",
  },
};

type PreferencesContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  improveModelForEveryone: boolean;
  setImproveModelForEveryone: (value: boolean) => void;
  t: (key: string, vars?: Record<string, string>) => string;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const LANGUAGE_STORAGE_KEY = "rh-language";
const IMPROVE_MODEL_STORAGE_KEY = "rh-improve-model";
const rtlLanguages = new Set<SupportedLanguage>(["ur", "ar"]);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const stored = localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    ) as SupportedLanguage | null;
    return stored && supportedLanguages.some((item) => item.value === stored)
      ? stored
      : "en";
  });

  const [improveModelForEveryone, setImproveModelForEveryone] =
    useState<boolean>(() => {
      const stored = localStorage.getItem(IMPROVE_MODEL_STORAGE_KEY);
      return stored === null ? true : stored === "true";
    });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    localStorage.setItem(
      IMPROVE_MODEL_STORAGE_KEY,
      String(improveModelForEveryone),
    );
  }, [improveModelForEveryone]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      setLanguage,
      improveModelForEveryone,
      setImproveModelForEveryone,
      t: (key, vars) => {
        const raw = translations[language]?.[key] ?? en[key] ?? key;

        if (!vars) {
          return raw;
        }

        return Object.entries(vars).reduce(
          (message, [name, replacement]) =>
            message.replaceAll(`{{${name}}}`, replacement),
          raw,
        );
      },
    }),
    [improveModelForEveryone, language],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }

  return context;
};
