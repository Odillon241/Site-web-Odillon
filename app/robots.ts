import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/dashboard/"],
      },
    ],
    sitemap: "https://www.odillon.fr/sitemap.xml",
    host: "https://www.odillon.fr",
  }
}
