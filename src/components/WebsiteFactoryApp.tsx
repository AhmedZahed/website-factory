import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  Blocks,
  CircleHelp,
  Compass,
  FileText,
  Globe2,
  LayoutDashboard,
  Layers3,
  PackageOpen,
  ShieldCheck,
  UsersRound,
  WandSparkles,
} from 'lucide-react';

export type WebsiteFactoryPage =
  | 'home'
  | 'dashboard'
  | 'customers'
  | 'websites'
  | 'templates'
  | 'orders';

type Language = 'ar' | 'en';

const routes: { page: Exclude<WebsiteFactoryPage, 'home'>; href: string; icon: typeof LayoutDashboard; label: { ar: string; en: string } }[] = [
  { page: 'dashboard', href: '/admin', icon: LayoutDashboard, label: { ar: 'نظرة عامة', en: 'Overview' } },
  { page: 'customers', href: '/admin/customers', icon: UsersRound, label: { ar: 'العملاء', en: 'Customers' } },
  { page: 'websites', href: '/admin/websites', icon: Globe2, label: { ar: 'المواقع', en: 'Websites' } },
  { page: 'templates', href: '/admin/templates', icon: Layers3, label: { ar: 'القوالب', en: 'Templates' } },
  { page: 'orders', href: '/admin/orders', icon: PackageOpen, label: { ar: 'الطلبات', en: 'Orders' } },
];

const pageNames: Record<WebsiteFactoryPage, { ar: string; en: string }> = {
  home: { ar: 'منصة واضحة لنمو أعمالك', en: 'A clearer place to grow your business' },
  dashboard: { ar: 'نظرة عامة', en: 'Overview' },
  customers: { ar: 'العملاء', en: 'Customers' },
  websites: { ar: 'المواقع', en: 'Websites' },
  templates: { ar: 'القوالب', en: 'Templates' },
  orders: { ar: 'الطلبات', en: 'Orders' },
};

export function getWebsiteFactoryPageTitle(page: WebsiteFactoryPage, language: Language = 'ar') {
  return `${pageNames[page][language]} | Website Factory`;
}

const text = {
  ar: {
    lang: 'English',
    languageLabel: 'Switch language to English',
    brandCaption: 'مساحة واحدة لأعمالك',
    home: 'الرئيسية',
    platform: 'المنصة',
    principles: 'ما يهمنا',
    howItWorks: 'كيف تبدأ',
    admin: 'معاينة الإدارة',
    heroEyebrow: 'أساس رقمي هادئ للأعمال الصغيرة',
    heroBefore: 'حضورك على الإنترنت،',
    heroAccent: 'بوضوح أكبر.',
    heroDescription: 'مكان واحد لترتيب أساس حضورك الرقمي — من المواقع إلى ما يدعم نمو أعمالك. بسيط من البداية، ومصمم ليتسع معك.',
    explore: 'استكشف المعاينة',
    whatItMeans: 'تعرّف على الفكرة',
    noCommitment: 'معاينة تأسيسية فقط، دون سجلات تشغيلية متصلة.',
    mockLabel: 'مساحة عمل بسيطة',
    mockTitle: 'ابدأ من صورة واضحة لأعمالك',
    mockCta: 'اكتشف المزيد',
    mockPill: 'واجهة عربية من البداية',
    mockNavHome: 'الرئيسية',
    mockNavStory: 'قصتنا',
    mockNavContact: 'تواصل',
    principlesKicker: 'فلسفة واضحة',
    principlesTitle: 'الأدوات يجب أن تمنحك مساحة للتفكير.',
    principlesIntro: 'نبني أساساً هادئاً ومفهوماً لأصحاب الأعمال، لا لوحة مليئة بالأرقام التي لا تعني شيئاً بعد.',
    principle1Title: 'كل شيء في مكانه',
    principle1Text: 'أساس منظم لما تحتاجه لتقديم عملك على الإنترنت، دون تنقل بين أدوات متفرقة.',
    principle2Title: 'لغة أقرب إليك',
    principle2Text: 'تجربة تبدأ بالعربية وتراعي طريقة عمل أصحاب المشاريع الصغيرة في المنطقة.',
    principle3Title: 'خطوات على مهل',
    principle3Text: 'بنية قابلة للنمو، تبدأ بعرض واضح ولا تفترض جاهزية كل شيء من اليوم الأول.',
    workflowKicker: 'من الفكرة إلى الأساس',
    workflowTitle: 'طريق مفهوم، خطوة بخطوة.',
    workflowIntro: 'Website Factory هي نقطة بداية لبناء مساحة رقمية لأعمالك. هذه معاينة للاتجاه، وليست منصة تشغيل مكتملة.',
    step1Title: 'افهم ما تحتاجه',
    step1Text: 'ابدأ برؤية واضحة للأجزاء التي ستدعم حضور عملك.',
    step2Title: 'نظّم مساحتك',
    step2Text: 'اجمع عناصر عملك الأساسية ضمن تجربة واحدة ومترابطة.',
    step3Title: 'انمُ في وقتك',
    step3Text: 'توسّع عندما تكون جاهزاً، دون تعقيد يسبق الحاجة.',
    ctaTitle: 'التأسيس الجيد يبدأ برؤية واضحة.',
    ctaText: 'ألقِ نظرة على معاينة الأساس الإداري.',
    footerNote: 'Website Factory — أساس رقمي للأعمال الصغيرة.',
    footerPreview: 'معاينة تأسيسية غير متصلة ببيانات تشغيلية.',
    adminPreview: 'معاينة تأسيسية للإدارة',
    adminMode: 'معاينة',
    sidebarSection: 'مساحة العمل',
    previewCardTitle: 'أساس قيد التأسيس',
    previewCardText: 'هذه الواجهة معاينة فقط. لا يوجد تسجيل دخول أو تشغيل فعلي متصل.',
    bannerTitle: 'معاينة غير موثّقة الدخول',
    bannerText: 'هذه شاشة تأسيسية لواجهة الإدارة. لا توجد سجلات تشغيلية متصلة، ولا تمثل هذه المعاينة نظام دخول جاهزاً للإنتاج.',
    dashboardSubtitle: 'لمحة عن بنية مساحة العمل المقترحة.',
    foundationTitle: 'أجزاء مساحة العمل',
    foundationSubtitle: 'عناصر واجهة أساسية — لا تعرض بيانات حقيقية.',
    foundationA: 'إدارة العملاء',
    foundationADesc: 'مكان مخصص لتنظيم بيانات العملاء عند توفر الربط.',
    foundationB: 'مساحة المواقع',
    foundationBDesc: 'نقطة انطلاق لإدارة حضور المواقع لاحقاً.',
    foundationC: 'القوالب والطلبات',
    foundationCDesc: 'مساحات مهيأة لتتكامل مع بنية المنتج مستقبلاً.',
    statusNotConnected: 'غير متصل',
    phaseOne: 'المرحلة الأولى',
    noteTitle: 'لا توجد سجلات بعد',
    noteText: 'لا توجد بيانات أو حسابات أو نشاط تشغيلي معروض في هذه المعاينة.',
    previewFooter: 'الواجهة التأسيسية لا تتضمن عمليات فعلية أو بيانات مرتبطة.',
    managementIntro: 'مساحة مخصصة ضمن المعاينة التأسيسية.',
    emptyTitle: 'لا توجد سجلات تشغيلية متصلة',
    emptyText: 'هذه صفحة إدارة تمهيدية. لا تُعرض فيها سجلات أو بيانات تجريبية، ولا توجد عمليات خلفية متصلة حالياً.',
    managementNote: 'ستعرض هذه المساحة محتواها عند ربط الخدمات والبيانات في مرحلة لاحقة.',
    goBack: 'العودة إلى النظرة العامة',
    openLanding: 'زيارة الصفحة الرئيسية',
    navHome: 'Website Factory',
    smallBusinesses: 'للأعمال الصغيرة',
  },
  en: {
    lang: 'العربية',
    languageLabel: 'تغيير اللغة إلى العربية',
    brandCaption: 'One place for your business',
    home: 'Home',
    platform: 'The platform',
    principles: 'Our principles',
    howItWorks: 'How it starts',
    admin: 'Admin preview',
    heroEyebrow: 'A calmer digital foundation for small business',
    heroBefore: 'Your online presence,',
    heroAccent: 'with more clarity.',
    heroDescription: 'One place to shape the foundations of your digital presence — from websites to the tools that support your growth. Simple at the start, ready to grow with you.',
    explore: 'Explore the preview',
    whatItMeans: 'See what we mean',
    noCommitment: 'A foundation preview only. No operational records are connected.',
    mockLabel: 'A simpler workspace',
    mockTitle: 'Start with a clear picture of your business',
    mockCta: 'Discover more',
    mockPill: 'Arabic-first by design',
    mockNavHome: 'Home',
    mockNavStory: 'Our story',
    mockNavContact: 'Contact',
    principlesKicker: 'A clear philosophy',
    principlesTitle: 'Your tools should make room to think.',
    principlesIntro: 'A calm, understandable foundation for business owners — not a dashboard full of numbers that mean nothing yet.',
    principle1Title: 'Everything in its place',
    principle1Text: 'A considered foundation for presenting your business online, without hopping between disconnected tools.',
    principle2Title: 'Closer to your language',
    principle2Text: 'An Arabic-first experience, shaped around how small businesses in the region work.',
    principle3Title: 'One step at a time',
    principle3Text: 'A foundation that can grow, starting with clarity rather than assumptions about what you need.',
    workflowKicker: 'From idea to foundation',
    workflowTitle: 'A path that makes sense, step by step.',
    workflowIntro: 'Website Factory is a starting point for your business online. This is a preview of the direction, not a complete operational platform.',
    step1Title: 'See what you need',
    step1Text: 'Get a clear view of the building blocks for your business online.',
    step2Title: 'Bring your workspace together',
    step2Text: 'Keep the foundations of your business in one connected experience.',
    step3Title: 'Grow at your own pace',
    step3Text: 'Expand when you are ready, without complexity arriving too soon.',
    ctaTitle: 'A good foundation starts with a clear view.',
    ctaText: 'Take a look at the admin foundation preview.',
    footerNote: 'Website Factory — a digital foundation for small businesses.',
    footerPreview: 'Foundation preview, not connected to operational data.',
    adminPreview: 'Admin foundation preview',
    adminMode: 'Preview',
    sidebarSection: 'Workspace',
    previewCardTitle: 'A foundation in progress',
    previewCardText: 'This interface is a preview only. No sign-in or operational system is connected.',
    bannerTitle: 'Unauthenticated foundation preview',
    bannerText: 'This is a foundation view of the admin interface. No operational records are connected, and this preview is not production-ready authentication.',
    dashboardSubtitle: 'A view of the proposed workspace foundations.',
    foundationTitle: 'Workspace foundations',
    foundationSubtitle: 'Interface building blocks — no live data shown.',
    foundationA: 'Customer management',
    foundationADesc: 'A place to organize customer information when connected.',
    foundationB: 'Website workspace',
    foundationBDesc: 'A starting point for managing web presence later.',
    foundationC: 'Templates and orders',
    foundationCDesc: 'Spaces prepared to connect to the product foundation in the future.',
    statusNotConnected: 'Not connected',
    phaseOne: 'Phase 1',
    noteTitle: 'No records yet',
    noteText: 'No data, accounts, or operational activity is displayed in this preview.',
    previewFooter: 'The foundation interface includes no live operations or connected records.',
    managementIntro: 'A dedicated space within the foundation preview.',
    emptyTitle: 'No operational records connected',
    emptyText: 'This is a management placeholder. No sample records or data are shown, and no back-office operations are connected.',
    managementNote: 'This space can show its content when services and data are connected in a future phase.',
    goBack: 'Back to overview',
    openLanding: 'Visit the homepage',
    navHome: 'Website Factory',
    smallBusinesses: 'For small businesses',
  },
} as const;

type Copy = Record<keyof typeof text.ar, string>;

function Brand({ caption }: { caption: string }) {
  return (
    <span className="wf-brand" aria-label="Website Factory">
      <span className="wf-brand-mark" aria-hidden="true"><Blocks size={19} strokeWidth={1.8} /></span>
      <span className="wf-brand-copy">
        <span className="wf-brand-name">Website Factory</span>
        <span className="wf-brand-caption">{caption}</span>
      </span>
    </span>
  );
}

function LanguageButton({ language, onToggle, labels }: { language: Language; onToggle: () => void; labels: Copy }) {
  return (
    <button
      className="wf-lang-button"
      type="button"
      onClick={onToggle}
      aria-label={labels.languageLabel}
      lang={language === 'ar' ? 'en' : 'ar'}
      data-testid="button-language"
    >
      {labels.lang}
    </button>
  );
}

function PublicHome({ language, labels, onToggle }: { language: Language; labels: Copy; onToggle: () => void }) {
  const directionIcon = language === 'ar' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />;
  return (
    <div className="wf-public">
      <div className="wf-topline" />
      <header className="wf-public-header">
        <a href="/" aria-label={labels.navHome} data-testid="link-brand-home"><Brand caption={labels.brandCaption} /></a>
        <nav className="wf-public-links" aria-label={language === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
          <a href="/">{labels.home}</a>
          <a href="#platform">{labels.platform}</a>
          <a href="#principles">{labels.principles}</a>
          <a href="#how-it-works">{labels.howItWorks}</a>
        </nav>
        <div className="wf-header-actions">
          <LanguageButton language={language} onToggle={onToggle} labels={labels} />
          <a className="wf-button wf-button-small" href="/admin" data-testid="link-admin-preview">{labels.admin}<span aria-hidden="true">{directionIcon}</span></a>
        </div>
      </header>

      <main>
        <section className="wf-hero" id="platform" aria-labelledby="wf-home-title">
          <div className="wf-hero-copy-wrap">
            <div className="wf-eyebrow"><span className="wf-eyebrow-dot" />{labels.heroEyebrow}</div>
            <h1 id="wf-home-title">{labels.heroBefore}<br /><em>{labels.heroAccent}</em></h1>
            <p className="wf-hero-copy">{labels.heroDescription}</p>
            <div className="wf-hero-actions">
              <a href="/admin" className="wf-button" data-testid="link-hero-admin">{labels.explore}<span aria-hidden="true">{directionIcon}</span></a>
              <a href="#principles" className="wf-button wf-button-secondary" data-testid="link-hero-principles">{labels.whatItMeans}</a>
            </div>
            <div className="wf-hero-note"><ShieldCheck size={15} aria-hidden="true" />{labels.noCommitment}</div>
          </div>
          <div className="wf-showcase" aria-label={language === 'ar' ? 'تصوّر لواجهة موقع' : 'Illustrative website preview'}>
            <div className="wf-browser">
              <div className="wf-browser-bar" aria-hidden="true"><i /><i /><i /><span className="wf-browser-address" /></div>
              <div className="wf-preview-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="wf-preview-nav"><span className="wf-preview-logo">BAYT</span><span className="wf-preview-link"><span>{labels.mockNavHome}</span><span>{labels.mockNavStory}</span><span>{labels.mockNavContact}</span></span></div>
                <div className="wf-preview-hero">
                  <div className="wf-preview-label">{labels.mockLabel}</div>
                  <div className="wf-preview-title">{labels.mockTitle}</div>
                  <div className="wf-preview-lines" aria-hidden="true"><i /><i /></div>
                  <span className="wf-preview-cta">{labels.mockCta}</span>
                </div>
                <div className="wf-preview-lower" aria-hidden="true"><div className="wf-preview-block" /><div className="wf-preview-block" /><div className="wf-preview-block" /></div>
              </div>
            </div>
            <div className="wf-float-tag"><WandSparkles size={15} aria-hidden="true" /><span>{labels.mockPill}</span></div>
          </div>
        </section>

        <section className="wf-section wf-principles" id="principles" aria-labelledby="wf-principles-title">
          <p className="wf-section-kicker">{labels.principlesKicker}</p>
          <h2 className="wf-section-heading" id="wf-principles-title">{labels.principlesTitle}</h2>
          <p className="wf-section-intro">{labels.principlesIntro}</p>
          <div className="wf-principle-grid">
            {[labels.principle1Title, labels.principle2Title, labels.principle3Title].map((title, index) => (
              <article className="wf-principle" key={title}>
                <span className="wf-principle-number">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{[labels.principle1Text, labels.principle2Text, labels.principle3Text][index]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="wf-section wf-workflow" id="how-it-works" aria-labelledby="wf-workflow-title">
          <div>
            <p className="wf-section-kicker">{labels.workflowKicker}</p>
            <h2 className="wf-section-heading" id="wf-workflow-title">{labels.workflowTitle}</h2>
            <p className="wf-section-intro">{labels.workflowIntro}</p>
          </div>
          <div className="wf-workflow-steps">
            {[labels.step1Title, labels.step2Title, labels.step3Title].map((title, index) => (
              <article className="wf-workflow-step" key={title}>
                <span className="wf-step-number">0{index + 1}</span>
                <div><h3>{title}</h3><p>{[labels.step1Text, labels.step2Text, labels.step3Text][index]}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="wf-callout" aria-labelledby="wf-callout-title">
          <div><h2 id="wf-callout-title">{labels.ctaTitle}</h2><p>{labels.ctaText}</p></div>
          <a className="wf-button" href="/admin" data-testid="link-callout-admin">{labels.admin}<span aria-hidden="true">{directionIcon}</span></a>
        </section>
      </main>

      <footer className="wf-footer">
        <a href="/" aria-label={labels.navHome}><Brand caption={labels.smallBusinesses} /></a>
        <span>{labels.footerNote}</span>
        <div className="wf-footer-links"><a href="/admin">{labels.admin}</a><span>{labels.footerPreview}</span></div>
      </footer>
    </div>
  );
}

function AdminPage({ page, language, labels, onToggle }: { page: Exclude<WebsiteFactoryPage, 'home'>; language: Language; labels: Copy; onToggle: () => void }) {
  const isDashboard = page === 'dashboard';
  const pageTitle = pageNames[page][language];
  const Icon = routes.find((item) => item.page === page)?.icon ?? LayoutDashboard;
  return (
    <div className="wf-admin">
      <aside className="wf-sidebar">
        <a href="/" aria-label={labels.navHome} data-testid="link-sidebar-brand"><Brand caption={labels.brandCaption} /></a>
        <p className="wf-nav-label">{labels.sidebarSection}</p>
        <nav className="wf-nav" aria-label={labels.sidebarSection}>
          {routes.map((item) => {
            const NavIcon = item.icon;
            return (
              <a
                href={item.href}
                className="wf-nav-link"
                aria-current={item.page === page ? 'page' : undefined}
                key={item.page}
                data-testid={`link-admin-${item.page}`}
              >
                <NavIcon size={17} strokeWidth={1.8} /><span>{item.label[language]}</span>
              </a>
            );
          })}
        </nav>
        <div className="wf-side-note">
          <Compass size={17} aria-hidden="true" />
          <h3>{labels.previewCardTitle}</h3>
          <p>{labels.previewCardText}</p>
        </div>
        <div className="wf-sidebar-bottom"><span>Website Factory</span><span>{labels.phaseOne}</span></div>
      </aside>

      <div className="wf-admin-main">
        <header className="wf-admin-topbar">
          <span className="wf-admin-crumb">{labels.adminPreview} / {pageTitle}</span>
          <div className="wf-header-actions">
            <LanguageButton language={language} onToggle={onToggle} labels={labels} />
            <a className="wf-button wf-button-secondary wf-button-small" href="/" data-testid="link-admin-home"><ArrowUpLeft size={14} aria-hidden="true" />{labels.openLanding}</a>
          </div>
        </header>
        <main className="wf-admin-content">
          <div className="wf-page-heading">
            <div>
              <span className="wf-page-overline">{labels.adminPreview}</span>
              <h1>{isDashboard ? labels.adminPreview : pageTitle}</h1>
              <p>{isDashboard ? labels.dashboardSubtitle : labels.managementIntro}</p>
            </div>
            <span className="wf-status">{labels.adminMode}</span>
          </div>

          <section className="wf-preview-banner" aria-label={labels.bannerTitle}>
            <ShieldCheck size={18} aria-hidden="true" />
            <div><strong>{labels.bannerTitle}</strong><p>{labels.bannerText}</p></div>
          </section>

          {isDashboard ? (
            <div className="wf-overview-grid">
              <section className="wf-panel" aria-labelledby="wf-foundation-title">
                <header className="wf-panel-heading"><h2 id="wf-foundation-title">{labels.foundationTitle}</h2><p>{labels.foundationSubtitle}</p></header>
                <div className="wf-foundation-list">
                  {[
                    { icon: UsersRound, title: labels.foundationA, description: labels.foundationADesc },
                    { icon: Globe2, title: labels.foundationB, description: labels.foundationBDesc },
                    { icon: FileText, title: labels.foundationC, description: labels.foundationCDesc },
                  ].map((item) => {
                    const RowIcon = item.icon;
                    return (
                      <div className="wf-foundation-row" key={item.title}>
                        <span className="wf-foundation-icon"><RowIcon size={16} aria-hidden="true" /></span>
                        <div><strong>{item.title}</strong><p>{item.description}</p></div>
                        <span className="wf-status">{labels.statusNotConnected}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
              <aside className="wf-panel wf-quiet-panel">
                <span className="wf-empty-icon"><CircleHelp size={18} aria-hidden="true" /></span>
                <h2>{labels.noteTitle}</h2>
                <p>{labels.noteText}</p>
              </aside>
            </div>
          ) : (
            <>
              <section className="wf-data-empty" aria-labelledby="wf-empty-title">
                <span className="wf-data-empty-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                <h2 id="wf-empty-title">{labels.emptyTitle}</h2>
                <p>{labels.emptyText}</p>
              </section>
              <div className="wf-management-note"><CircleHelp size={15} aria-hidden="true" /><span>{labels.managementNote}</span></div>
            </>
          )}

          {isDashboard && <div className="wf-admin-footer">{labels.previewFooter}</div>}
          {!isDashboard && (
            <div className="wf-admin-footer">
              <a className="wf-button wf-button-secondary wf-button-small" href="/admin" data-testid="link-back-overview"><ArrowRight size={14} aria-hidden="true" />{labels.goBack}</a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function WebsiteFactoryApp({ page }: { page: WebsiteFactoryPage }) {
  const [language, setLanguage] = useState<Language>('ar');
  const labels = text[language];
  const toggleLanguage = () => setLanguage((current) => current === 'ar' ? 'en' : 'ar');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = getWebsiteFactoryPageTitle(page, language);
  }, [language, page]);

  return (
    <div className="wf-root" dir={language === 'ar' ? 'rtl' : 'ltr'} lang={language}>
      {page === 'home'
        ? <PublicHome language={language} labels={labels} onToggle={toggleLanguage} />
        : <AdminPage page={page} language={language} labels={labels} onToggle={toggleLanguage} />}
    </div>
  );
}

export default WebsiteFactoryApp;
