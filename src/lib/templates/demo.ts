import type {
  TemplateCustomization,
  TemplateDefinition,
  TemplateSectionType,
} from "./types.ts";
import type { TemplateId } from "./registry.ts";

interface DemoItem {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category?: { ar: string; en: string };
  meta?: { ar: string; en: string };
  featured?: boolean;
}

interface DemoSection {
  eyebrow?: { ar: string; en: string };
  title: { ar: string; en: string };
  description?: { ar: string; en: string };
  items?: DemoItem[];
}

interface DemoProfile {
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  colors: TemplateCustomization["brand"]["colors"];
  headingFont: TemplateCustomization["brand"]["typography"]["heading"];
  bodyFont: TemplateCustomization["brand"]["typography"]["body"];
  sections: Partial<Record<TemplateSectionType, DemoSection>>;
}

const profile: Record<TemplateId, DemoProfile> = {
  "builtin-services-maintenance": {
    name: { ar: "ركن الصيانة", en: "Service Corner" },
    tagline: {
      ar: "خدمات يومية واضحة للمنازل والمنشآت.",
      en: "Clear everyday services for homes and workplaces.",
    },
    description: {
      ar: "معاينة توضيحية لفريق خدمات وصيانة. استبدل هذه المعلومات ببيانات عملك.",
      en: "A sample service and maintenance profile. Replace it with your business details.",
    },
    colors: {
      primary: "#184A5B",
      secondary: "#C9E4DD",
      accent: "#E78A4E",
      background: "#F5F5F0",
      text: "#18323A",
    },
    headingFont: "arabic-sans",
    bodyFont: "system",
    sections: {
      services: {
        title: { ar: "خدماتنا", en: "Our services" },
        description: {
          ar: "فئات توضيحية؛ حدّثها لتطابق الخدمات التي يقدمها نشاطك فعلياً.",
          en: "Illustrative categories; update these to match the services your business actually offers.",
        },
        items: [
          { title: { ar: "صيانة التكييف", en: "Air conditioning" }, description: { ar: "أضف تفاصيل الفحص أو الصيانة التي يقدمها نشاطك.", en: "Describe the inspection or maintenance your business offers." } },
          { title: { ar: "أعمال السباكة", en: "Plumbing" }, description: { ar: "أدرج الإصلاحات أو التركيبات المتاحة من فريقك.", en: "List the repairs or installations available from your team." } },
          { title: { ar: "الصيانة الكهربائية", en: "Electrical maintenance" }, description: { ar: "أضف أنواع الأعمال الكهربائية التي يقدمها نشاطك.", en: "Describe the electrical work your business offers." } },
          { title: { ar: "التنظيف", en: "Cleaning" }, description: { ar: "وضّح أنواع المساحات أو جداول التنظيف المتاحة.", en: "Describe the spaces or cleaning schedules you support." } },
          { title: { ar: "مكافحة الآفات", en: "Pest control" }, description: { ar: "أضف الآفات وخيارات المعالجة التي يتعامل معها فريقك.", en: "List the pests and treatment options your team handles." } },
          { title: { ar: "صيانة منزلية عامة", en: "General home maintenance" }, description: { ar: "أدرج الإصلاحات والمهام المنزلية التي يقدمها نشاطك.", en: "List the home repairs and tasks your business offers." } },
        ],
      },
      process: {
        title: { ar: "خطوات العمل", en: "How it works" },
        description: {
          ar: "خطوات توضيحية؛ استبدلها بآلية الطلب الفعلية لديك.",
          en: "Illustrative steps; replace these with your actual request process.",
        },
        items: [
          { title: { ar: "تواصل", en: "Get in touch" }, description: { ar: "اختر وسيلة التواصل المناسبة.", en: "Choose the contact method that works for you." } },
          { title: { ar: "تحديد الاحتياج", en: "Describe the work" }, description: { ar: "أضف تفاصيل الخدمة المطلوبة.", en: "Share the service details you need." } },
          { title: { ar: "تأكيد الموعد", en: "Confirm a time" }, description: { ar: "تُضاف آلية المواعيد من صاحب العمل.", en: "The business can add its appointment process." } },
        ],
      },
      locations: {
        title: { ar: "أين نقدم الخدمة؟", en: "Where we work" },
        description: { ar: "تُضاف المدن والأحياء التي يغطيها النشاط.", en: "Add the towns and neighborhoods your team covers." },
      },
      benefits: {
        title: { ar: "لماذا تختارنا؟", en: "Why choose us?" },
        description: {
          ar: "أمثلة توضيحية فقط؛ اعتمد معايير الخدمة الفعلية قبل النشر.",
          en: "Illustrative examples only; confirm your actual service standards before publishing.",
        },
        items: [
          { title: { ar: "وضوح نطاق العمل", en: "Clear scope" }, description: { ar: "وضّح العمل المطلوب وأي تكاليف متوقعة قبل البدء.", en: "Clarify the requested work and any applicable cost before starting." } },
          { title: { ar: "تنظيم الزيارة", en: "A planned visit" }, description: { ar: "اتفق على وقت الزيارة وتفاصيل الدخول إلى الموقع.", en: "Agree on a visit time and any site-access details." } },
          { title: { ar: "تحديثات واضحة", en: "Clear updates" }, description: { ar: "اشرح أي تغيير والخطوة التالية بلغة مباشرة.", en: "Explain any changes and next steps in plain language." } },
        ],
      },
      faq: {
        title: { ar: "أسئلة شائعة", en: "Frequently asked questions" },
        description: {
          ar: "أمثلة توضيحية؛ راجع الأسعار والمواعيد ونطاق الخدمة قبل النشر.",
          en: "Illustrative examples; confirm pricing, availability, and service scope before publishing.",
        },
        items: [
          { title: { ar: "كيف أطلب زيارة؟", en: "How do I request a visit?" }, description: { ar: "شارك وصف المشكلة وموقعها والوقت المفضل، ثم أكّد التفاصيل مع النشاط.", en: "Share the issue, location, and preferred time, then confirm details with the business." } },
          { title: { ar: "هل تخدمون منطقتي؟", en: "Do you cover my area?" }, description: { ar: "أرسل اسم المدينة أو الحي ليتأكد النشاط من نطاق الخدمة الحالي.", en: "Send your city or neighborhood so the business can confirm its current service area." } },
          { title: { ar: "هل يمكن طلب أكثر من خدمة؟", en: "Can I request more than one service?" }, description: { ar: "اذكر كل مهمة في طلبك ليتم تأكيد النطاق والتوفر.", en: "List each task in your request so the scope and availability can be confirmed." } },
        ],
      },
    },
  },
  "builtin-contracting-real-estate": {
    name: { ar: "خط العمران", en: "Urban Line" },
    tagline: {
      ar: "مساحة لعرض أعمال المقاولات والمشاريع.",
      en: "A place to present contracting work and projects.",
    },
    description: {
      ar: "معاينة توضيحية لمشاريع وخدمات مقاولات. لا تمثل هذه البيانات أعمالاً منفذة.",
      en: "A sample contracting portfolio. The displayed examples are not completed projects.",
    },
    colors: {
      primary: "#253A50",
      secondary: "#D6C09B",
      accent: "#B76343",
      background: "#F5F0E8",
      text: "#27384C",
    },
    headingFont: "editorial-serif",
    bodyFont: "system",
    sections: {
      projects: {
        title: { ar: "دراسات مكانية", en: "Studies in place" },
        description: { ar: "أمثلة مفاهيمية للمعاينة فقط، وليست مشاريع منفذة أو موثقة.", en: "Illustrative demo concepts only; these are not completed or documented projects." },
        items: [
          { title: { ar: "فناء من الحجر والظل", en: "Stone & shade courtyard" }, description: { ar: "تصور سكني توضيحي؛ استبدل الوصف بمشروع موثق تملكه.", en: "Illustrative residential concept. Replace with a verified project you own." }, category: { ar: "سكني", en: "Residential" } },
          { title: { ar: "حافة مدنية", en: "Civic edge" }, description: { ar: "تصور لمساحة تجارية؛ ليس مشروعاً منفذاً أو عميلاً حقيقياً.", en: "Commercial-space concept; not a completed project or real client." }, category: { ar: "تجاري", en: "Commercial" } },
          { title: { ar: "امتداد صناعي", en: "Industrial volume" }, description: { ar: "تصور صناعي توضيحي قابل للاستبدال بصورك الأصلية.", en: "Illustrative industrial concept, ready to be replaced by your own photography." }, category: { ar: "صناعي", en: "Industrial" } },
        ],
      },
      services: {
        title: { ar: "فكرة متماسكة، من الموقع إلى التفاصيل", en: "One coherent idea, from site to detail" },
        description: { ar: "قدرات توضيحية قابلة للتعديل؛ اعرض ما يقدمه فريقك فعلياً فقط.", en: "Editable sample capabilities; keep only the services your team genuinely offers." },
        items: [
          { title: { ar: "التصميم المعماري", en: "Architectural design" }, description: { ar: "تُضاف مراحل التصميم والمخرجات المعتمدة من المكتب.", en: "Add the design stages and deliverables confirmed by the studio." } },
          { title: { ar: "التصميم الداخلي", en: "Interior design" }, description: { ar: "وضح نطاق التصميم الداخلي والمواد التي يعمل بها الفريق.", en: "Describe your interior-design scope and the materials your team works with." } },
          { title: { ar: "التنفيذ والمقاولات", en: "Construction & contracting" }, description: { ar: "أدرج أنواع التنفيذ ونطاق الأعمال المتاح فعلياً.", en: "List the construction types and scope your company actually undertakes." } },
          { title: { ar: "التطوير العقاري", en: "Real estate development" }, description: { ar: "أضف خدمات التطوير أو إدارة الأصول التي يقدمها نشاطك.", en: "Add development or asset-management services your business provides." } },
        ],
      },
      process: {
        title: { ar: "طريقة العمل", en: "A way of working" },
        description: { ar: "تسلسل نموذجي؛ عدّله ليتطابق مع إجراءات فريقك الفعلية.", en: "A suggested sequence; edit it to match your team's real process." },
        items: [
          { title: { ar: "الاستماع إلى brief المشروع", en: "Understand the brief" }, description: { ar: "نطاق وموقع وأولويات — تُحدد التفاصيل مع العميل.", en: "Scope, site and priorities, confirmed together with the client." } },
          { title: { ar: "تطوير الرؤية", en: "Develop the vision" }, description: { ar: "تُوضح مخرجات التصميم والجدول بعد مراجعة احتياج المشروع.", en: "Agree design deliverables and timing after reviewing the project's needs." } },
          { title: { ar: "التنسيق والتنفيذ", en: "Coordinate & deliver" }, description: { ar: "أضف مراحل التنسيق والتنفيذ التي يعتمدها فريقك.", en: "Add the coordination and delivery stages your team follows." } },
        ],
      },
      testimonials: {
        title: { ar: "شهادات العملاء", en: "Client voices" },
        description: { ar: "لا توجد شهادات في المعاينة. أضف مراجعات حقيقية بعد موافقة أصحابها.", en: "No testimonials are included in this preview. Add genuine feedback with permission." },
      },
      faq: {
        title: { ar: "قبل أن نبدأ", en: "Before we begin" },
        description: { ar: "أسئلة نموذجية؛ راجع الإجابات لتطابق شروط عملك.", en: "Sample questions; revise the answers to reflect your actual terms." },
        items: [
          { title: { ar: "ما المعلومات اللازمة لبدء النقاش؟", en: "What should I share to start a discussion?" }, description: { ar: "موجز المشروع والموقع والجدول المتوقع وأي ملفات متاحة تساعد على فهم النطاق.", en: "A project brief, site, expected timeline and available files help establish the scope." } },
          { title: { ar: "هل الصور المعروضة مشاريع منفذة؟", en: "Are the images completed projects?" }, description: { ar: "لا. جميع الصور الافتراضية تصورات توضيحية ويجب استبدالها بأعمال معتمدة قبل النشر.", en: "No. Default images are illustrative concepts and should be replaced with approved work before publishing." } },
        ],
      },
    },
  },
  "builtin-corporate-professional": {
    name: { ar: "مدار الأعمال", en: "Business Orbit" },
    tagline: {
      ar: "ملف تعريفي منظم للشركات والخبرات المهنية.",
      en: "A structured profile for companies and professional expertise.",
    },
    description: {
      ar: "معاينة تعريفية قابلة للتخصيص ببيانات الشركة وخدماتها المعتمدة.",
      en: "A customizable company profile using verified business details and services.",
    },
    colors: {
      primary: "#182E57",
      secondary: "#DAE2F0",
      accent: "#A98053",
      background: "#F8F9FC",
      text: "#192940",
    },
    headingFont: "modern-sans",
    bodyFont: "system",
    sections: {
      services: {
        title: { ar: "الخدمات المهنية", en: "Professional services" },
        items: [
          { title: { ar: "التخطيط", en: "Planning" }, description: { ar: "أضف وصف الخدمة ونطاقها.", en: "Add the service description and scope." } },
          { title: { ar: "الاستشارات", en: "Consulting" }, description: { ar: "أضف وصف الخدمة ونطاقها.", en: "Add the service description and scope." } },
          { title: { ar: "التنفيذ", en: "Delivery" }, description: { ar: "أضف وصف الخدمة ونطاقها.", en: "Add the service description and scope." } },
        ],
      },
      team: {
        title: { ar: "الفريق", en: "The team" },
        description: { ar: "تُضاف الأسماء والخبرات بعد اعتمادها.", en: "Add team names and experience after verification." },
      },
    },
  },
  "builtin-restaurants-cafes-juice": {
    name: { ar: "دار الليمون", en: "Dar Al Lemon" },
    tagline: {
      ar: "نكهات طازجة، وقهوة على مهل، ومكان يجمعنا.",
      en: "Fresh plates, slow coffee, and a place to gather.",
    },
    description: {
      ar: "مساحة نموذجية لمطعم أو مقهى أو مخبز. استبدل النصوص والصور النموذجية بتفاصيل المكان المعتمدة.",
      en: "A sample hospitality profile for a restaurant, cafe, or bakery. Replace the sample copy and imagery with verified details about your place.",
    },
    colors: {
      primary: "#562A27",
      secondary: "#F3DDA5",
      accent: "#D66E42",
      background: "#FFF6E9",
      text: "#39251F",
    },
    headingFont: "editorial-serif",
    bodyFont: "system",
    sections: {
      menu: {
        title: { ar: "من المطبخ إلى المائدة", en: "From our kitchen to your table" },
        description: { ar: "أصناف وصور نموذجية قابلة للاستبدال؛ أضف القائمة والأسعار المعتمدة فقط.", en: "Replaceable sample dishes and imagery. Add your approved menu and verified prices only." },
        items: [
          { title: { ar: "طبق الموسم", en: "The seasonal plate" }, description: { ar: "مثال قابل للاستبدال — أضف مكونات الطبق ووصفه المعتمد.", en: "Replaceable sample — add the confirmed ingredients and description." }, category: { ar: "من المطبخ", en: "From the kitchen" }, featured: true },
          { title: { ar: "خبز الصباح", en: "Morning bake" }, description: { ar: "مثال قابل للاستبدال — اكتب وصف المخبوزات التي تقدمها.", en: "Replaceable sample — describe the baked goods you serve." }, category: { ar: "المخبز", en: "Bakery" } },
          { title: { ar: "قهوة اليوم", en: "Coffee, your way" }, description: { ar: "مثال قابل للاستبدال — أضف تفاصيل القهوة والتحضير.", en: "Replaceable sample — add the coffee and preparation details." }, category: { ar: "من البار", en: "From the bar" }, featured: true },
          { title: { ar: "عصير الحمضيات", en: "Citrus press" }, description: { ar: "مثال قابل للاستبدال — وضّح المكونات المتاحة.", en: "Replaceable sample — list the ingredients you offer." }, category: { ar: "من البار", en: "From the bar" } },
          { title: { ar: "حلوى الدار", en: "Something sweet" }, description: { ar: "مثال قابل للاستبدال — أضف وصف الحلوى المعتمد.", en: "Replaceable sample — add the confirmed dessert description." }, category: { ar: "من المخبز", en: "Bakery" } },
          { title: { ar: "طبق للمشاركة", en: "A plate to share" }, description: { ar: "مثال قابل للاستبدال — أضف التفاصيل التي تهم ضيوفك.", en: "Replaceable sample — add the details your guests need." }, category: { ar: "من المطبخ", en: "From the kitchen" } },
        ],
      },
      story: {
        title: { ar: "كل شيء يبدأ بمكوّن طازج ومائدة مفتوحة.", en: "It starts with something fresh, and a table left open." },
        description: { ar: "قصة نموذجية قابلة للاستبدال بكلمات المكان وأسلوبه الحقيقي.", en: "Replace this sample story with the real voice and history of your place." },
        items: [
          { title: { ar: "من أول رشفة", en: "The first sip" }, description: { ar: "هذه مساحة لقصة المكان: ما الذي يلهم المطبخ، ومن أين تأتي النكهات، وكيف تحبون استقبال ضيوفكم. النص والصورة هنا أمثلة قابلة للاستبدال.", en: "A space for your story: what inspires the kitchen, where the flavours come from, and how you welcome people in. This copy and image are replaceable samples." } },
        ],
      },
      gallery: {
        title: { ar: "مساحة للقاء، وللبقاء قليلاً.", en: "A space to meet, and stay a little." },
        description: { ar: "صور نموذجية قابلة للاستبدال بصور المكان والأطباق الأصلية.", en: "Replaceable sample photos; add original images of your dishes and space." },
      },
      "opening-hours": {
        title: { ar: "تعالوا حين يناسبكم", en: "Drop in when it suits you" },
        description: { ar: "أضف أوقات العمل المعتمدة قبل النشر.", en: "Add confirmed opening hours before publishing." },
      },
      locations: {
        title: { ar: "نلتقي على المائدة", en: "Let’s meet around the table" },
        description: { ar: "أضف الفروع وعناوينها أو روابط الخرائط المعتمدة.", en: "Add confirmed branches, addresses, or safe map links." },
      },
      contact: {
        title: { ar: "للطلب أو الحجز، يسعدنا تواصلكم", en: "For orders or reservations, get in touch" },
        description: { ar: "تظهر وسائل التواصل عند إضافتها إلى بيانات النشاط.", en: "Contact and reservation actions appear when you add your business details." },
      },
    },
  },
  "builtin-shops-personal-services": {
    name: { ar: "مساحة قريبة", en: "A Nearby Place" },
    tagline: {
      ar: "واجهة مرنة لمتجر أو خدمة شخصية.",
      en: "A flexible storefront for a local shop or personal service.",
    },
    description: {
      ar: "معاينة تجريبية للمنتجات والخدمات؛ أضف بيانات عملك قبل النشر.",
      en: "A sample product and service view; add your business details before publishing.",
    },
    colors: {
      primary: "#4A443B",
      secondary: "#F0D37D",
      accent: "#527966",
      background: "#F8F4E9",
      text: "#302B24",
    },
    headingFont: "modern-sans",
    bodyFont: "arabic-sans",
    sections: {
      catalog: {
        title: { ar: "مختارات من المتجر", en: "Shop highlights" },
        description: { ar: "أضف المنتجات المتاحة والأسعار المعتمدة.", en: "Add available products and verified prices." },
        items: [
          { title: { ar: "منتج مميز", en: "Featured item" }, description: { ar: "تفاصيل المنتج يضيفها المتجر.", en: "Product details supplied by the shop." } },
          { title: { ar: "اختيار جديد", en: "New arrival" }, description: { ar: "تفاصيل المنتج يضيفها المتجر.", en: "Product details supplied by the shop." } },
        ],
      },
      "featured-services": {
        title: { ar: "الخدمات", en: "Services" },
        items: [
          { title: { ar: "خدمة حسب الطلب", en: "Personalized service" }, description: { ar: "أضف الشروط والتفاصيل.", en: "Add the terms and details." } },
          { title: { ar: "الحجز أو الاستفسار", en: "Booking or inquiry" }, description: { ar: "أضف وسيلة التواصل المناسبة.", en: "Add the contact method that works for you." } },
        ],
      },
    },
  },
  "builtin-law-firms-legal": {
    name: { ar: "اسم المكتب القانوني", en: "Law Firm Name" },
    tagline: {
      ar: "مساحة تعريفية للخدمات القانونية.",
      en: "A profile space for legal services.",
    },
    description: {
      ar: "معاينة تجريبية. لا تحتوي على مؤهلات أو تراخيص أو ادعاءات قانونية مختلقة.",
      en: "A demo only. No credentials, licenses, or legal claims are invented.",
    },
    colors: {
      primary: "#172D46",
      secondary: "#E7DDC8",
      accent: "#A6814F",
      background: "#F7F3E9",
      text: "#263243",
    },
    headingFont: "editorial-serif",
    bodyFont: "arabic-sans",
    sections: {
      "lawyer-intro": {
        title: { ar: "التعريف بالمكتب", en: "About the firm" },
        description: { ar: "تُضاف نبذة المكتب المعتمدة هنا.", en: "Add the firm's approved introduction here." },
      },
      "practice-areas": {
        title: { ar: "مجالات الممارسة", en: "Practice areas" },
        description: {
          ar: "أمثلة توضيحية فقط؛ راجع مجالات الممارسة الفعلية قبل النشر.",
          en: "Illustrative examples only; confirm the firm's actual practice areas before publishing.",
        },
        items: [
          { title: { ar: "المعاملات التجارية", en: "Commercial matters" }, description: { ar: "مثال توضيحي فقط؛ أضف نطاق الخدمات المعتمد من المكتب.", en: "Illustrative only; add the firm's approved service scope." } },
          { title: { ar: "صياغة العقود", en: "Contract drafting" }, description: { ar: "مثال توضيحي فقط؛ أضف نطاق الخدمات المعتمد من المكتب.", en: "Illustrative only; add the firm's approved service scope." } },
          { title: { ar: "تسوية النزاعات", en: "Dispute resolution" }, description: { ar: "مثال توضيحي فقط؛ أضف نطاق الخدمات المعتمد من المكتب.", en: "Illustrative only; add the firm's approved service scope." } },
        ],
      },
      qualifications: {
        title: { ar: "المؤهلات والخبرة", en: "Qualifications and experience" },
        description: { ar: "تُضاف المؤهلات والخبرات بعد اعتمادها من المكتب.", en: "Add qualifications and experience after firm verification." },
      },
      consultation: {
        title: { ar: "طلب استشارة", en: "Request a consultation" },
        description: { ar: "يُفعّل التواصل عند إضافة بيانات المكتب.", en: "Contact options appear when firm details are provided." },
      },
      articles: {
        title: { ar: "مقالات تعريفية", en: "Informational articles" },
        description: { ar: "تُضاف مواد يراجعها المكتب قبل عرضها.", en: "Add materials reviewed by the firm before display." },
      },
      accreditation: {
        title: { ar: "الترخيص والاعتماد", en: "License and accreditation" },
        description: { ar: "تُعرض البيانات عند تقديم معلومات الترخيص والاعتماد المعتمدة.", en: "Display only license and accreditation details supplied and verified by the firm." },
      },
    },
  },
};

export function createDemoCustomization(
  template: TemplateDefinition,
): TemplateCustomization {
  const demo = profile[template.id as TemplateId];
  return {
    schemaVersion: 1,
    business: {
      name: demo.name,
      tagline: demo.tagline,
      description: demo.description,
    },
    brand: {
      colors: demo.colors,
      typography: {
        heading: demo.headingFont,
        body: demo.bodyFont,
      },
    },
    images: {
      ...(template.id === "builtin-contracting-real-estate" ? {
        hero: {
          src: "/images/contracting-residential-concept.jpg",
          alt: {
            ar: "تصور معماري توضيحي لمنزل معاصر وفناء، صورة قابلة للاستبدال",
            en: "Illustrative concept of a contemporary home and courtyard; replaceable demo image",
          },
        },
      } : {}),
      ...(template.id === "builtin-services-maintenance" ? {
        hero: {
          src: "/images/services-maintenance-hero.jpg",
          alt: {
            ar: "فني صيانة يفحص وحدة تكييف داخل منزل",
            en: "A maintenance technician inspecting a home air-conditioning unit",
          },
        },
      } : {}),
      ...(template.id === "builtin-restaurants-cafes-juice" ? {
        hero: {
          src: "/images/restaurants-hero.jpg",
          alt: {
            ar: "مائدة طعام ومشروب حمضيات — صورة مفاهيمية نموذجية قابلة للاستبدال",
            en: "A styled meal and citrus drink — replaceable concept sample image",
          },
        },
      } : {}),
      gallery: template.id === "builtin-restaurants-cafes-juice" ? [
        { src: "/images/restaurants-menu-meal.jpg", alt: { ar: "طبق نباتي وخبز — صورة نموذجية قابلة للاستبدال", en: "Plant-forward plate and bread — replaceable sample image" } },
        { src: "/images/restaurants-menu-coffee.jpg", alt: { ar: "فنجان قهوة — صورة نموذجية قابلة للاستبدال", en: "A cup of coffee — replaceable sample image" } },
        { src: "/images/restaurants-menu-juice.jpg", alt: { ar: "عصير حمضيات — صورة نموذجية قابلة للاستبدال", en: "Fresh citrus drink — replaceable sample image" } },
        { src: "/images/restaurants-atmosphere.jpg", alt: { ar: "أجواء مقهى — صورة نموذجية قابلة للاستبدال", en: "Cafe interior atmosphere — replaceable sample image" } },
      ] : template.id === "builtin-contracting-real-estate" ? [
        {
          src: "/images/contracting-residential-concept.jpg",
          alt: { ar: "تصور سكني توضيحي، وليس مشروعاً منفذاً", en: "Residential concept image, not a completed project" },
        },
        {
          src: "/images/contracting-commercial-concept.jpg",
          alt: { ar: "تصور تجاري توضيحي، وليس مشروعاً منفذاً", en: "Commercial concept image, not a completed project" },
        },
        {
          src: "/images/contracting-industrial-concept.jpg",
          alt: { ar: "تصور صناعي توضيحي، وليس مشروعاً منفذاً", en: "Industrial concept image, not a completed project" },
        },
      ] : [],
    },
    sections: template.supportedSections.map((type, order) => ({
      id: `${template.slug}-${type}`,
      type,
      order,
      visible: !(template.category === "law-firms-legal" && type === "accreditation"),
      content: (demo.sections[type] as unknown as Record<string, unknown>) ?? (
        type === "hero"
          ? {
              title: demo.name,
              tagline: demo.tagline,
              description: demo.description,
            }
          : {
              title: template.name,
              description: template.description,
            }
      ),
    })),
  };
}
