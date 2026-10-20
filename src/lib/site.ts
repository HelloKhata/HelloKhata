export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** Social profiles: add only verified, official accounts. Empty means none are rendered. */
export const socialLinks: { label: string; href: string }[] = [];

/** Official contact details. Display strings are localised; links always use the international format. */
export const contactInfo = {
  phone: { href: "tel:+8801734114388", display: "+880 1734-114388" },
  whatsapp: { href: "https://wa.me/8801922557436", display: "+880 1922-557436" },
  email: { href: "mailto:contact@hellokhata.com", display: "contact@hellokhata.com" },
  address: {
    en: "38 Shah Makhdum Avenue, Sector 13, Uttara, Dhaka 1230",
    bn: "৩৮ শাহ মখদুম এভিনিউ, সেক্টর ১৩, উত্তরা, ঢাকা ১২৩০",
    mapHref: "https://www.google.com/maps/search/?api=1&query=38+Shah+Makhdum+Avenue%2C+Sector+13%2C+Uttara%2C+Dhaka+1230",
  },
};

/** Phone numbers shown with Bangla digits on Bangla pages. */
export const localDigits = (s: string, locale: "bn" | "en") => (locale === "bn" ? s.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]) : s);
