import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/bn/sign-in", "/en/sign-in"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
