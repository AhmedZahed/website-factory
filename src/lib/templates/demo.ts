import type {
  TemplateCustomization,
  TemplateDefinition,
  TemplateSectionType,
} from "./types.ts";
import type { TemplateId } from "./registry.ts";

interface DemoItem {
  title: { ar: string; en: string };
  description: { ar: string; en: string };
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
        title: { ar: "نماذج للمشاريع", en: "Project examples" },
        description: { ar: "أضف صور ووصف المشاريع بعد مراجعة بياناتها.", en: "Add project images and descriptions after verifying their details." },
        items: [
          { title: { ar: "مشروع سكني — مثال", en: "Residential project — sample" }, description: { ar: "مساحة مخصصة لبيانات مشروع معتمد.", en: "A placeholder for a verified project." } },
          { title: { ar: "مساحة تجارية — مثال", en: "Commercial space — sample" }, description: { ar: "مساحة مخصصة لبيانات مشروع معتمد.", en: "A placeholder for a verified project." } },
        ],
      },
      services: {
        title: { ar: "مجالات العمل", en: "Areas of work" },
        items: [
          { title: { ar: "تنفيذ المشاريع", en: "Project delivery" }, description: { ar: "تُضاف التفاصيل والنطاق من الشركة.", en: "Scope and details are supplied by the company." } },
          { title: { ar: "إدارة العقارات", en: "Property management" }, description: { ar: "تُضاف الخدمات المتاحة من الشركة.", en: "Available services are supplied by the company." } },
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
    name: { ar: "مائدة الحي", en: "Neighborhood Table" },
    tagline: {
      ar: "قائمة ومعلومات زيارة في مكان واحد.",
      en: "Menu and visit information in one place.",
    },
    description: {
      ar: "معاينة لمطعم أو مقهى. حدّث القائمة والأسعار قبل النشر.",
      en: "A restaurant or cafe sample. Verify menu items and prices before publishing.",
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
        title: { ar: "من القائمة", en: "From the menu" },
        description: { ar: "أمثلة شكلية فقط؛ أضف الأصناف والأسعار الصحيحة.", en: "Visual examples only; add verified menu items and prices." },
        items: [
          { title: { ar: "صنف مميز", en: "Featured dish" }, description: { ar: "الوصف والسعر يضافان من المطعم.", en: "The restaurant supplies the description and price." } },
          { title: { ar: "مشروب موسمي", en: "Seasonal drink" }, description: { ar: "الوصف والسعر يضافان من المطعم.", en: "The restaurant supplies the description and price." } },
          { title: { ar: "اختيار يومي", en: "Daily choice" }, description: { ar: "الوصف والسعر يضافان من المطعم.", en: "The restaurant supplies the description and price." } },
        ],
      },
      "opening-hours": {
        title: { ar: "أوقات العمل", en: "Opening hours" },
        description: { ar: "أضف الجدول المعتمد قبل النشر.", en: "Add verified hours before publishing." },
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
      ...(template.id === "builtin-services-maintenance" ? {
        hero: {
          src: "/images/services-maintenance-hero.jpg",
          alt: {
            ar: "فني صيانة يفحص وحدة تكييف داخل منزل",
            en: "A maintenance technician inspecting a home air-conditioning unit",
          },
        },
      } : {}),
      gallery: [],
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
