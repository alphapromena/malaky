import {
  Book,
  Cloud,
  CreditCard,
  Database as DatabaseIcon,
  FileText,
  Github,
  Globe2,
  Hash,
  Image as ImageIcon,
  ImagePlus,
  Mail,
  MessageCircle,
  Package,
  Plug,
  Search,
  Send,
  Triangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type IntegrationCategory = 'search' | 'chat' | 'productivity' | 'dev' | 'media' | 'billing' | 'mcp';

export type IntegrationStatus = 'available' | 'beta' | 'coming-soon';

export type AuthType = 'native' | 'oauth' | 'api-key' | 'webhook' | 'admin';

export type Integration = {
  id: string;
  name: string;
  nameAr: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  authType: AuthType;
  icon: LucideIcon;
  /** short pitch in Arabic */
  summary: string;
  /** longer description in Arabic */
  description: string;
  /** when this is connected, what does Malaky gain? */
  capabilities: string[];
  /** URL where the user goes to obtain credentials or learn more */
  docsUrl?: string;
};

export const CATEGORY_LABELS: Record<IntegrationCategory, { en: string; ar: string }> = {
  search:       { en: 'Search & Knowledge',  ar: 'البحث والمعرفة' },
  chat:         { en: 'Chat Platforms',      ar: 'منصّات المحادثة' },
  productivity: { en: 'Productivity',        ar: 'الإنتاجية' },
  dev:          { en: 'Developer Tools',     ar: 'أدوات التطوير' },
  media:        { en: 'Media',               ar: 'الوسائط' },
  billing:      { en: 'Billing & Comms',     ar: 'الفوترة والمراسلات' },
  mcp:          { en: 'MCP Servers',         ar: 'خوادم MCP' },
};

export const STATUS_LABELS: Record<IntegrationStatus, { ar: string; tone: 'ok' | 'warn' | 'soon' }> = {
  available:     { ar: 'متاح',   tone: 'ok'   },
  beta:          { ar: 'تجريبي', tone: 'warn' },
  'coming-soon': { ar: 'قريباً',  tone: 'soon' },
};

export const INTEGRATIONS: Integration[] = [
  // ─── Search & Knowledge ───────────────────────────────────────────
  {
    id: 'web-search',
    name: 'Web Search',
    nameAr: 'البحث على الإنترنت',
    category: 'search',
    status: 'available',
    authType: 'native',
    icon: Search,
    summary: 'ملاكي يبحث على الإنترنت قبل ما يرد.',
    description:
      'يستخدم أداة البحث المدمجة في Claude لجلب معلومات حديثة من الإنترنت. مفيد للأخبار، الأسعار، الإحصائيات، والأحداث الجارية.',
    capabilities: [
      'يبحث في الويب تلقائياً عند الحاجة',
      'يقتبس المصادر في الرد',
      'يعمل في الكاتب والمبرمج',
    ],
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    nameAr: 'ويكيبيديا',
    category: 'search',
    status: 'coming-soon',
    authType: 'native',
    icon: Book,
    summary: 'مرجع موسوعي عربي سريع.',
    description:
      'يسمح لملاكي بقراءة مقالات ويكيبيديا العربية مباشرة لاسترجاع التعريفات والمعلومات التاريخية والثقافية بدقة.',
    capabilities: [
      'ويكيبيديا العربية هي المصدر الافتراضي',
      'يستخدم REST API العام (بدون مفاتيح)',
      'استشهاد بالمقال المصدر',
    ],
    docsUrl: 'https://ar.wikipedia.org/api/rest_v1/',
  },
  {
    id: 'arxiv',
    name: 'arXiv',
    nameAr: 'أرخايف',
    category: 'search',
    status: 'coming-soon',
    authType: 'native',
    icon: FileText,
    summary: 'أوراق بحثية للمبرمج والباحث.',
    description:
      'يبحث في قاعدة بيانات arXiv للأوراق البحثية في علوم الحاسوب، الرياضيات، والفيزياء، ويلخّصها بالعربية.',
    capabilities: [
      'بحث بالكلمات المفتاحية أو DOI',
      'ملخّص عربي للورقة',
      'روابط المؤلفين والتصنيفات',
    ],
    docsUrl: 'https://info.arxiv.org/help/api/index.html',
  },

  // ─── Chat Platforms ───────────────────────────────────────────────
  {
    id: 'slack',
    name: 'Slack',
    nameAr: 'سلاك',
    category: 'chat',
    status: 'coming-soon',
    authType: 'oauth',
    icon: Hash,
    summary: 'ملاكي كعضو في workspace.',
    description:
      'أضف ملاكي كـ bot في مساحة Slack، استخدم /malaky في أي قناة، وخلّيه يلخّص الرسائل أو يولّد محتوى دون الخروج من Slack.',
    capabilities: [
      'سلاش كوماند /malaky في أي قناة',
      'ذكر @Malaky للرد المباشر',
      'لخّص الرسائل عبر Slash',
      'حفظ المحادثات في سجل ملاكي',
    ],
    docsUrl: 'https://api.slack.com/apps',
  },
  {
    id: 'discord',
    name: 'Discord',
    nameAr: 'ديسكورد',
    category: 'chat',
    status: 'coming-soon',
    authType: 'oauth',
    icon: Hash,
    summary: 'ملاكي في سيرفر Discord.',
    description:
      'Bot يدخل سيرفرك ويرد على أي قناة يُشار فيها. يدعم الأوضاع الثلاثة عبر slash commands.',
    capabilities: [
      '/write /code /image كسلاش كوماند',
      'يرد في threads',
      'يحترم حدودك اليومية',
    ],
    docsUrl: 'https://discord.com/developers/applications',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    nameAr: 'تليغرام',
    category: 'chat',
    status: 'coming-soon',
    authType: 'api-key',
    icon: Send,
    summary: 'Bot شخصي في تليغرام.',
    description:
      'احصل على Bot token من BotFather واربطه بملاكي. راح تقدر ترسل لرسائل والـ AI يرد خلال ثواني.',
    capabilities: [
      'شات مباشر مع Bot',
      'يقبل الصور والملفات',
      'نفس التفضيلات (nickname, لهجة)',
    ],
    docsUrl: 'https://t.me/BotFather',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    nameAr: 'واتساب بزنس',
    category: 'chat',
    status: 'coming-soon',
    authType: 'webhook',
    icon: MessageCircle,
    summary: 'ملاكي على رقم WhatsApp.',
    description:
      'اربط رقم WhatsApp Business عبر Meta Cloud API أو Twilio. يرد لعملائك أو لك شخصياً.',
    capabilities: [
      'webhook receiver لرسائل واتساب',
      'يرد بالعربي مع كشف اللهجة',
      'نموذج رسائل قابلة للتخصيص',
    ],
    docsUrl: 'https://developers.facebook.com/docs/whatsapp',
  },

  // ─── Productivity ─────────────────────────────────────────────────
  {
    id: 'notion',
    name: 'Notion',
    nameAr: 'نوشن',
    category: 'productivity',
    status: 'coming-soon',
    authType: 'oauth',
    icon: FileText,
    summary: 'احفظ محادثاتك كصفحات Notion.',
    description:
      'احفظ أي محادثة كصفحة Notion في workspace الخاص فيك، مع الوسوم والتصنيف التلقائي.',
    capabilities: [
      'تصدير محادثة لصفحة Notion',
      'مزامنة تلقائية اختيارية',
      'تنظيم حسب الـ mode',
    ],
    docsUrl: 'https://developers.notion.com/docs/authorization',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    nameAr: 'جوجل درايف',
    category: 'productivity',
    status: 'coming-soon',
    authType: 'oauth',
    icon: Cloud,
    summary: 'ارفع مولّداتك لـ Drive تلقائياً.',
    description:
      'كل صورة يولّدها المصمم، وكل مستند كتبه الكاتب، يُرفع إلى مجلد Malaky في Google Drive.',
    capabilities: [
      'رفع تلقائي للصور',
      'تصدير المحادثات كـ Google Docs',
      'مشاركة مع فريقك',
    ],
    docsUrl: 'https://developers.google.com/drive',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    nameAr: 'دروب بوكس',
    category: 'productivity',
    status: 'coming-soon',
    authType: 'oauth',
    icon: Package,
    summary: 'نفس Drive، لكن في Dropbox.',
    description:
      'مزامنة صور ومحادثات ملاكي إلى مجلد Dropbox.',
    capabilities: ['نسخ احتياطي تلقائي', 'سجل إصدارات'],
    docsUrl: 'https://www.dropbox.com/developers',
  },

  // ─── Developer Tools ─────────────────────────────────────────────
  {
    id: 'github',
    name: 'GitHub',
    nameAr: 'جيت هاب',
    category: 'dev',
    status: 'coming-soon',
    authType: 'oauth',
    icon: Github,
    summary: 'المبرمج يقرأ ويكتب في repos.',
    description:
      'اربط حساب GitHub وخلّي المبرمج يقرأ ملفات، ينشئ PRs، يفتح Issues، ويعلّق على الـ reviews.',
    capabilities: [
      'قراءة أي ملف في repo',
      'إنشاء Pull Requests',
      'تعليقات على الكود',
      'مراجعة PRs ذاتياً',
    ],
    docsUrl: 'https://github.com/settings/developers',
  },
  {
    id: 'vercel',
    name: 'Vercel',
    nameAr: 'فيرسيل',
    category: 'dev',
    status: 'coming-soon',
    authType: 'api-key',
    icon: Triangle,
    summary: 'نشر وإدارة مشاريعك من الشات.',
    description:
      'اربط حساب Vercel للاستعلام عن حالة الـ deployments، إعادة النشر، وإدارة المتغيرات البيئية.',
    capabilities: [
      'قائمة مشاريعك',
      'حالة آخر deployment',
      'Redeploy بأمر واحد',
      'تحديث env variables',
    ],
    docsUrl: 'https://vercel.com/account/tokens',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    nameAr: 'سوبا بيس',
    category: 'dev',
    status: 'coming-soon',
    authType: 'api-key',
    icon: DatabaseIcon,
    summary: 'استعلامات SQL من الشات.',
    description:
      'اربط مشاريع Supabase الخاصة فيك، واستعلم عن البيانات، راجع الـ migrations، أو استرجع types من المحادثة.',
    capabilities: [
      'execute SQL read-only',
      'قراءة جداول ومخططات',
      'توليد TypeScript types',
    ],
    docsUrl: 'https://supabase.com/dashboard/account/tokens',
  },

  // ─── Media ────────────────────────────────────────────────────────
  {
    id: 'unsplash',
    name: 'Unsplash',
    nameAr: 'أنسبلاش',
    category: 'media',
    status: 'coming-soon',
    authType: 'api-key',
    icon: ImageIcon,
    summary: 'صور مرجعية احترافية.',
    description:
      'المصمم يستطيع جلب صور مرجعية من Unsplash قبل توليد صورة جديدة، أو تضمينها في المحتوى.',
    capabilities: [
      'بحث عن صور بكلمة عربية أو إنجليزية',
      'رابط تحميل مباشر',
      'استشهاد بالمصوّر',
    ],
    docsUrl: 'https://unsplash.com/developers',
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    nameAr: 'كلاودينري',
    category: 'media',
    status: 'coming-soon',
    authType: 'api-key',
    icon: ImagePlus,
    summary: 'CDN وتحويلات للصور المولّدة.',
    description:
      'صور ملاكي المولّدة تذهب لـ CDN خاص فيك، مع تحويلات فورية (resize, blur, watermark).',
    capabilities: [
      'رفع تلقائي عند التوليد',
      'تحويلات URL-based',
      'CDN عالمي سريع',
    ],
    docsUrl: 'https://cloudinary.com/console',
  },

  // ─── Billing / Comms ─────────────────────────────────────────────
  {
    id: 'stripe',
    name: 'Stripe',
    nameAr: 'سترايب',
    category: 'billing',
    status: 'coming-soon',
    authType: 'admin',
    icon: CreditCard,
    summary: 'مدفوعات Pro و Team.',
    description:
      'بوابة الدفع لخطط Pro و Team. سيُفعّل لما تكون خطط الاشتراك جاهزة.',
    capabilities: [
      'Checkout Session',
      'فواتير PDF تلقائية',
      'إدارة الاشتراك',
    ],
    docsUrl: 'https://stripe.com/docs',
  },
  {
    id: 'resend',
    name: 'Resend',
    nameAr: 'ريسند',
    category: 'billing',
    status: 'coming-soon',
    authType: 'admin',
    icon: Mail,
    summary: 'إيميلات ترحيب وتنبيهات.',
    description:
      'نستخدمه لإرسال إيميلات التأكيد، إعادة تعيين كلمة السر، وتنبيهات الفوترة.',
    capabilities: [
      'قوالب عربية جاهزة',
      'تتبّع التسليم',
      'نطاق مخصّص',
    ],
    docsUrl: 'https://resend.com/docs',
  },

  // ─── MCP Servers ─────────────────────────────────────────────────
  {
    id: 'mcp-filesystem',
    name: 'Filesystem MCP',
    nameAr: 'نظام الملفات',
    category: 'mcp',
    status: 'coming-soon',
    authType: 'admin',
    icon: Plug,
    summary: 'MCP server لقراءة ملفاتك المحلية.',
    description:
      'عبر Model Context Protocol، يصل ملاكي لملفات جهازك المحلي (بإذنك) — مفيد لمهام البرمجة الطويلة.',
    capabilities: [
      'قراءة ملفات بإذن صريح',
      'بحث في المجلدات',
      'يعمل محلياً (عميل MCP)',
    ],
    docsUrl: 'https://modelcontextprotocol.io/servers',
  },
  {
    id: 'mcp-git',
    name: 'Git MCP',
    nameAr: 'جيت MCP',
    category: 'mcp',
    status: 'coming-soon',
    authType: 'admin',
    icon: Plug,
    summary: 'MCP server لعمليات git محلية.',
    description:
      'عمليات Git كاملة من المحادثة: log, diff, commit, branch. يعمل عبر MCP client محلي.',
    capabilities: ['git log / diff / status', 'commit و push', 'إنشاء branches'],
    docsUrl: 'https://modelcontextprotocol.io/servers',
  },

  // ─── Misc ────────────────────────────────────────────────────────
  {
    id: 'brave-search',
    name: 'Brave Search',
    nameAr: 'بحث Brave',
    category: 'search',
    status: 'coming-soon',
    authType: 'api-key',
    icon: Globe2,
    summary: 'بديل محرك بحث مع صلاحيات.',
    description:
      'بحث بديل عن Google باستخدام Brave Search API. مفيد إذا كان عندك subscription خاصة.',
    capabilities: ['بحث ويب', 'بحث أخبار', 'بحث صور'],
    docsUrl: 'https://brave.com/search/api/',
  },
];

export function getIntegration(id: string): Integration | null {
  return INTEGRATIONS.find((i) => i.id === id) ?? null;
}

export function integrationsByCategory(): Array<{
  category: IntegrationCategory;
  items: Integration[];
}> {
  const grouped = new Map<IntegrationCategory, Integration[]>();
  for (const i of INTEGRATIONS) {
    const arr = grouped.get(i.category) ?? [];
    arr.push(i);
    grouped.set(i.category, arr);
  }
  const order: IntegrationCategory[] = ['search', 'dev', 'productivity', 'chat', 'media', 'mcp', 'billing'];
  return order
    .filter((c) => grouped.has(c))
    .map((category) => ({ category, items: grouped.get(category)! }));
}
