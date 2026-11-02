import type { Locale } from "@/i18n/config";

export interface PrivacySection {
  id: string;
  num: string;
  title: string;
  bodyIntro?: string;
  items?: { title: string; desc: string; icon: string }[];
  list?: string[];
  paragraphs?: string[];
  alert?: {
    type: "info" | "warning" | "shield";
    title?: string;
    text: string;
  };
}

export interface PrivacyPolicyContent {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  lead: string;
  entityBadge: string;
  tocTitle: string;
  summaryTitle: string;
  summaryPills: { label: string; value: string }[];
  sections: PrivacySection[];
  contact: {
    id: string;
    num: string;
    title: string;
    lead: string;
    operatorLabel: string;
    operatorValue: string;
    addressLabel: string;
    addressValue: string;
    emailLabel: string;
    emailValue: string;
    emailHref: string;
    phoneLabel: string;
    phoneValue: string;
    phoneHref: string;
    websiteLabel: string;
    websiteValue: string;
    websiteHref: string;
    legalHandlingNote: string;
  };
  footerNotice: {
    label: string;
    copyright: string;
  };
}

export const privacyPolicyData: Record<Locale, PrivacyPolicyContent> = {
  en: {
    eyebrow: "Legal & Transparency",
    title: "Privacy Policy",
    lastUpdated: "Effective 2026",
    lead: "HelloKhata is owned and operated by Maple Service Solution Limited, a company registered in Bangladesh. We are committed to protecting your personal and business information. This Privacy Policy explains how we collect, use, store and share information when you use our website, applications and services.",
    entityBadge: "Maple Service Solution Limited · Bangladesh",
    tocTitle: "On this page",
    summaryTitle: "Policy Overview",
    summaryPills: [
      { label: "Entity", value: "Maple Service Solution Ltd." },
      { label: "Jurisdiction", value: "Bangladesh" },
      { label: "Data Sale", value: "Never sold or rented" },
      { label: "AI & Voice", value: "Encrypted & authorized" },
    ],
    sections: [
      {
        id: "information-we-collect",
        num: "01",
        title: "1. Information We Collect",
        bodyIntro: "We may collect the following information:",
        items: [
          {
            title: "Personal Information",
            desc: "Name, phone number, email address and account details.",
            icon: "user",
          },
          {
            title: "Business Information",
            desc: "Business name, products, inventory, sales, purchases, expenses, customer, supplier and employee records.",
            icon: "store",
          },
          {
            title: "Technical Information",
            desc: "IP address, device information, browser details, usage logs and cookies.",
            icon: "laptop",
          },
          {
            title: "AI and Voice Information",
            desc: "Voice recordings, text inputs, prompts and business information submitted through our AI features.",
            icon: "sparkles",
          },
        ],
      },
      {
        id: "how-we-use-your-information",
        num: "02",
        title: "2. How We Use Your Information",
        bodyIntro: "We use your information to:",
        list: [
          "Provide and maintain HelloKhata services",
          "Manage sales, purchases, inventory, accounts and business operations",
          "Process AI requests and generate business insights",
          "Send SMS alerts, notifications and service updates",
          "Provide customer support and improve our services",
          "Maintain security, prevent fraud and comply with legal obligations",
        ],
      },
      {
        id: "ai-and-voice-processing",
        num: "03",
        title: "3. AI and Voice Processing",
        paragraphs: [
          "HelloKhata uses AI technology to process voice inputs, text instructions and relevant business information to provide assistance and perform authorized tasks. Information may be processed by third-party AI and technology providers to deliver these features.",
        ],
        alert: {
          type: "warning",
          title: "Important Verification Notice",
          text: "AI-generated results may not always be accurate. Users should verify important financial and business information before relying on it.",
        },
      },
      {
        id: "information-sharing",
        num: "04",
        title: "4. Information Sharing",
        paragraphs: [
          "We do not sell or rent your personal or business information.",
          "We may share information with trusted hosting, cloud, AI, analytics, SMS and communication providers, authorized integration partners, professional advisers and government authorities where required by law.",
          "Third-party providers may process information only for authorized purposes, subject to applicable legal and contractual safeguards.",
        ],
        alert: {
          type: "shield",
          title: "Our Commitment",
          text: "Your customer records, financial accounts and ledger entries remain strictly confidential and will never be monetized or sold to third parties.",
        },
      },
      {
        id: "data-security-and-retention",
        num: "05",
        title: "5. Data Security and Retention",
        paragraphs: [
          "We implement reasonable technical and organizational safeguards to protect information against unauthorized access, loss, misuse or disclosure.",
          "We retain information only as long as necessary to provide our services, fulfill contractual obligations and meet legal requirements. Information that is no longer required will be securely deleted, anonymized or disposed of, subject to applicable law.",
          "No electronic system can be guaranteed to be completely secure.",
        ],
      },
      {
        id: "your-privacy-rights",
        num: "06",
        title: "6. Your Privacy Rights",
        paragraphs: [
          "Subject to applicable law, you may request access to, correction of or deletion of your personal information. You may also withdraw consent where processing is based on consent and exercise other applicable data protection rights.",
          "Requests can be submitted through our contact details below. We may verify your identity before processing a request.",
        ],
      },
      {
        id: "cookies-and-third-party",
        num: "07",
        title: "7. Cookies and Third-Party Services",
        paragraphs: [
          "Our website may use cookies and similar technologies to maintain sessions, remember preferences and improve performance.",
          "HelloKhata may also integrate with third-party platforms. Their services are governed by their own privacy policies, which we encourage you to review.",
        ],
      },
      {
        id: "childrens-privacy",
        num: "08",
        title: "8. Children's Privacy",
        paragraphs: [
          "HelloKhata is intended for business owners and authorized business users, not for independent use by children. We do not knowingly collect children's personal information unlawfully.",
        ],
      },
      {
        id: "international-data-processing",
        num: "09",
        title: "9. International Data Processing",
        paragraphs: [
          "Your information may be processed or stored outside Bangladesh through our technology and service providers.",
          "Any international transfer will be subject to applicable data protection laws and required safeguards.",
        ],
      },
      {
        id: "policy-updates",
        num: "10",
        title: "10. Policy Updates",
        paragraphs: [
          "We may update this Privacy Policy to reflect changes in our services, technology or legal requirements. Updates will be published on this page with a revised date. Additional notice or consent will be provided where required by law.",
        ],
      },
    ],
    contact: {
      id: "contact-us",
      num: "11",
      title: "11. Contact Us",
      lead: "For privacy-related questions, requests or complaints, contact:",
      operatorLabel: "Operator of HelloKhata",
      operatorValue: "Maple Service Solution Limited",
      addressLabel: "Address",
      addressValue: "38 (3rd Floor), Shah Makhdum Avenue, Sector 13, Uttara, Dhaka-1230, Bangladesh.",
      emailLabel: "Email",
      emailValue: "info@mapleitfirm.com",
      emailHref: "mailto:info@mapleitfirm.com",
      phoneLabel: "Phone",
      phoneValue: "+8801922557436",
      phoneHref: "tel:+8801922557436",
      websiteLabel: "Website",
      websiteValue: "https://hellokhata.com",
      websiteHref: "https://hellokhata.com",
      legalHandlingNote: "We will handle privacy requests in accordance with applicable laws.",
    },
    footerNotice: {
      label: "HELLOKHATA | PRIVACY",
      copyright: "© 2026 HelloKhata. All Rights Reserved.",
    },
  },
  bn: {
    eyebrow: "আইনি ও স্বচ্ছতা",
    title: "গোপনীয়তা নীতি",
    lastUpdated: "কার্যকর ২০২৬",
    lead: "HelloKhata এর মালিকানা ও পরিচালনায় রয়েছে Maple Service Solution Limited, যা বাংলাদেশে নিবন্ধিত একটি প্রতিষ্ঠান। আমরা আপনার ব্যক্তিগত ও ব্যবসায়িক তথ্যের সুরক্ষায় প্রতিশ্রুতিবদ্ধ। আপনি যখন আমাদের ওয়েবসাইট, অ্যাপ্লিকেশন ও সেবা ব্যবহার করেন, তখন আমরা কীভাবে তথ্য সংগ্রহ, ব্যবহার, সংরক্ষণ ও শেয়ার করি তা এই গোপনীয়তা নীতিতে ব্যাখ্যা করা হয়েছে।",
    entityBadge: "Maple Service Solution Limited · বাংলাদেশ",
    tocTitle: "এই পেজে রয়েছে",
    summaryTitle: "নীতিমালার সারসংক্ষেপ",
    summaryPills: [
      { label: "পরিচালনাকারী", value: "Maple Service Solution Ltd." },
      { label: "আইনি এখতিয়ার", value: "বাংলাদেশ" },
      { label: "তথ্য বিক্রি", value: "কখনোই বিক্রি বা ভাড়া নয়" },
      { label: "এআই ও ভয়েস", value: "এনক্রিপ্টকৃত ও অনুমোদিত" },
    ],
    sections: [
      {
        id: "information-we-collect",
        num: "০১",
        title: "১. আমরা যে তথ্য সংগ্রহ করি",
        bodyIntro: "আমরা নিম্নোক্ত তথ্যসমূহ সংগ্রহ করতে পারি:",
        items: [
          {
            title: "ব্যক্তিগত তথ্য (Personal Information)",
            desc: "নাম, ফোন নম্বর, ইমেইল ঠিকানা এবং অ্যাকাউন্টের বিবরণ।",
            icon: "user",
          },
          {
            title: "ব্যবসায়িক তথ্য (Business Information)",
            desc: "ব্যবসার নাম, পণ্যসামগ্রী, ইনভেন্টরি, বিক্রয়, ক্রয়, খরচ, গ্রাহক, সরবরাহকারী এবং কর্মীদের রেকর্ড।",
            icon: "store",
          },
          {
            title: "প্রযুক্তিগত তথ্য (Technical Information)",
            desc: "আইপি (IP) ঠিকানা, ডিভাইসের বিবরণ, ব্রাউজারের তথ্য, ব্যবহারের লগ এবং কুকিজ।",
            icon: "laptop",
          },
          {
            title: "এআই এবং ভয়েস তথ্য (AI and Voice Information)",
            desc: "আমাদের এআই ফিচারের মাধ্যমে প্রদত্ত ভয়েস রেকর্ডিং, টেক্সট ইনপুট, প্রম্পট এবং ব্যবসায়িক তথ্য।",
            icon: "sparkles",
          },
        ],
      },
      {
        id: "how-we-use-your-information",
        num: "০২",
        title: "২. আপনার তথ্য যেভাবে আমরা ব্যবহার করি",
        bodyIntro: "আমরা আপনার তথ্য নিম্নলিখিত উদ্দেশ্যে ব্যবহার করি:",
        list: [
          "HelloKhata সেবা প্রদান ও পরিচালনা করা",
          "বিক্রয়, ক্রয়, ইনভেন্টরি, হিসাব ও ব্যবসায়িক কার্যক্রম পরিচালনা করা",
          "এআই অনুরোধ প্রসেস করা ও ব্যবসায়িক অন্তর্দৃষ্টি তৈরি করা",
          "এসএমএস অ্যালার্ট, নোটিফিকেশন ও সেবামূলক আপডেট পাঠানো",
          "গ্রাহক সেবা প্রদান ও আমাদের সেবার মানোন্নয়ন করা",
          "নিরাপত্তা বজায় রাখা, প্রতারণা প্রতিরোধ করা এবং আইনি বাধ্যবাধকতা মেনে চলা",
        ],
      },
      {
        id: "ai-and-voice-processing",
        num: "০৩",
        title: "৩. এআই এবং ভয়েস প্রসেসিং",
        paragraphs: [
          "HelloKhata ভয়েস ইনপুট, টেক্সট নির্দেশনা এবং প্রাসঙ্গিক ব্যবসায়িক তথ্য প্রসেস করে সহায়তা প্রদান ও অনুমোদিত কাজ সম্পাদনের জন্য এআই প্রযুক্তি ব্যবহার করে। এই ফিচারগুলো প্রদানের জন্য তৃতীয় পক্ষের এআই ও প্রযুক্তি সরবরাহকারী প্রতিষ্ঠানের মাধ্যমে তথ্য প্রসেস করা হতে পারে।",
        ],
        alert: {
          type: "warning",
          title: "গুরুত্বপূর্ণ যাচাইকরণ বিজ্ঞপ্তি",
          text: "এআই দ্বারা প্রস্তুত ফলাফল সবসময় নির্ভুল নাও হতে পারে। গুরুত্বপূর্ণ আর্থিক ও ব্যবসায়িক তথ্যের ওপর নির্ভর করার আগে ব্যবহারকারীদের তা যাচাই করে নেওয়া উচিত।",
        },
      },
      {
        id: "information-sharing",
        num: "০৪",
        title: "৪. তথ্য আদান-প্রদান বা শেয়ারিং",
        paragraphs: [
          "আমরা আপনার ব্যক্তিগত বা ব্যবসায়িক তথ্য বিক্রি বা ভাড়া দিই না।",
          "আমরা বিশ্বস্ত হোস্টিং, ক্লাউড, এআই, অ্যানালিটিক্স, এসএমএস ও যোগাযোগ সেবাদাতা, অনুমোদিত ইন্টিগ্রেশন পার্টনার, পেশাদার পরামর্শক এবং আইন অনুযায়ী আবশ্যক হলে সরকারি কর্তৃপক্ষের সাথে তথ্য শেয়ার করতে পারি।",
          "তৃতীয় পক্ষের সেবাদাতারা প্রযোজ্য আইনি ও চুক্তিভিত্তিক সুরক্ষার শর্ত মেনে কেবল অনুমোদিত উদ্দেশ্যেই তথ্য প্রসেস করতে পারে।",
        ],
        alert: {
          type: "shield",
          title: "আমাদের অঙ্গীকার",
          text: "আপনার গ্রাহক রেকর্ড, আর্থিক হিসাব এবং খাতার এন্ট্রিগুলো সম্পূর্ণ গোপনীয় থাকে এবং কখনোই তৃতীয় পক্ষের কাছে বিক্রি বা বাণিজ্যিকভাবে হস্তান্তর করা হয় না।",
        },
      },
      {
        id: "data-security-and-retention",
        num: "০৫",
        title: "৫. ডেটা নিরাপত্তা ও সংরক্ষণ",
        paragraphs: [
          "অননুমোদিত প্রবেশ, হারানো, অপব্যবহার বা প্রকাশ থেকে তথ্য রক্ষা করতে আমরা যুক্তিসঙ্গত প্রযুক্তিগত ও প্রাতিষ্ঠানিক নিরাপত্তাব্যবস্থা গ্রহণ করি।",
          "আমাদের সেবা প্রদান, চুক্তিভিত্তিক দায়িত্ব পালন ও আইনি প্রয়োজনীয়তা পূরণের জন্য যতক্ষণ প্রয়োজন, ততক্ষণই আমরা তথ্য সংরক্ষণ করি। যে তথ্যের আর প্রয়োজন নেই, তা প্রযোজ্য আইন অনুযায়ী নিরাপদে মুছে ফেলা, বেনামী করা বা নিষ্পত্তি করা হবে।",
          "কোনো ইলেকট্রনিক সিস্টেমই শতভাগ নিরাপদ হিসেবে গ্যারান্টি দেওয়া সম্ভব নয়।",
        ],
      },
      {
        id: "your-privacy-rights",
        num: "০৬",
        title: "৬. আপনার গোপনীয়তা অধিকার",
        paragraphs: [
          "প্রযোজ্য আইন সাপেক্ষে, আপনি আপনার ব্যক্তিগত তথ্য দেখার (access), সংশোধন করার বা মুছে ফেলার অনুরোধ করতে পারেন। এছাড়াও যেখানে তথ্য প্রক্রিয়াকরণ সম্মতির ওপর ভিত্তি করে হয়, সেখানে আপনি সম্মতি প্রত্যাহার করতে পারেন এবং প্রযোজ্য অন্যান্য ডেটা সুরক্ষা অধিকার প্রয়োগ করতে পারেন।",
          "নিচে উল্লেখিত আমাদের যোগাযোগের ঠিকানায় অনুরোধ জমা দেওয়া যাবে। অনুরোধটি কার্যকর করার পূর্বে আমরা আপনার পরিচয় যাচাই করে নিতে পারি।",
        ],
      },
      {
        id: "cookies-and-third-party",
        num: "০৭",
        title: "৭. কুকিজ এবং তৃতীয় পক্ষের সেবা",
        paragraphs: [
          "আমাদের ওয়েবসাইট সেশন বজায় রাখতে, পছন্দসমূহ মনে রাখতে এবং পারফরম্যান্স উন্নত করতে কুকিজ ও সমজাতীয় প্রযুক্তি ব্যবহার করতে পারে।",
          "HelloKhata তৃতীয় পক্ষের প্ল্যাটফর্মের সাথেও যুক্ত হতে পারে। তাদের সেবা তাদের নিজস্ব গোপনীয়তা নীতি দ্বারা পরিচালিত হয়, যা পর্যালোচনা করার জন্য আমরা আপনাকে উৎসাহিত করি।",
        ],
      },
      {
        id: "childrens-privacy",
        num: "০৮",
        title: "৮. শিশুদের গোপনীয়তা",
        paragraphs: [
          "HelloKhata ব্যবসায়ী ও অনুমোদিত ব্যবসায়িক ব্যবহারকারীদের জন্য তৈরি, শিশুদের স্বাধীন ব্যবহারের জন্য নয়। আমরা জেনে-বুঝে বেআইনিভাবে শিশুদের ব্যক্তিগত তথ্য সংগ্রহ করি না।",
        ],
      },
      {
        id: "international-data-processing",
        num: "০৯",
        title: "৯. আন্তর্জাতিক ডেটা প্রক্রিয়াকরণ",
        paragraphs: [
          "আমাদের প্রযুক্তি ও সেবাদাতাদের মাধ্যমে আপনার তথ্য বাংলাদেশের বাইরে প্রক্রিয়াজাত বা সংরক্ষিত হতে পারে।",
          "যেকোনো আন্তর্জাতিক তথ্য স্থানান্তরের ক্ষেত্রে প্রযোজ্য ডেটা সুরক্ষা আইন ও প্রয়োজনীয় সুরক্ষাব্যবস্থা মেনে চলা হবে।",
        ],
      },
      {
        id: "policy-updates",
        num: "১০",
        title: "১০. নীতিমালার হালনাগাদ",
        paragraphs: [
          "আমাদের সেবা, প্রযুক্তি বা আইনি প্রয়োজনীয়তার পরিবর্তনের সাথে সাথে আমরা এই গোপনীয়তা নীতি হালনাগাদ করতে পারি। হালনাগাদসমূহ একটি সংশোধিত তারিখসহ এই পেজে প্রকাশ করা হবে। আইন দ্বারা আবশ্যক হলে অতিরিক্ত নোটিশ প্রদান বা সম্মতি গ্রহণ করা হবে।",
        ],
      },
    ],
    contact: {
      id: "contact-us",
      num: "১১",
      title: "১১. আমাদের সাথে যোগাযোগ",
      lead: "গোপনীয়তা সংক্রান্ত প্রশ্ন, অনুরোধ বা অভিযোগের জন্য যোগাযোগ করুন:",
      operatorLabel: "HelloKhata-এর পরিচালক",
      operatorValue: "Maple Service Solution Limited",
      addressLabel: "ঠিকানা",
      addressValue: "৩৮ (৪র্থ তলা / ৩য় ফ্লোর), শাহ মাখদুম এভিনিউ, সেক্টর ১৩, উত্তরা, ঢাকা-১২৩০, বাংলাদেশ।",
      emailLabel: "ইমেইল",
      emailValue: "info@mapleitfirm.com",
      emailHref: "mailto:info@mapleitfirm.com",
      phoneLabel: "ফোন",
      phoneValue: "+৮৮০ ১৯২২৫৫৭৪৩৬",
      phoneHref: "tel:+8801922557436",
      websiteLabel: "ওয়েবসাইট",
      websiteValue: "https://hellokhata.com",
      websiteHref: "https://hellokhata.com",
      legalHandlingNote: "আমরা প্রযোজ্য আইন অনুসারে গোপনীয়তার অনুরোধগুলো পর্যালোচনা ও নিষ্পত্তি করব।",
    },
    footerNotice: {
      label: "HELLOKHATA | PRIVACY",
      copyright: "© ২০২৬ HelloKhata। সর্বস্বত্ব সংরক্ষিত।",
    },
  },
};
