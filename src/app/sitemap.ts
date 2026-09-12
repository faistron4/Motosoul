import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://example.com", lastModified: new Date() },
    { url: "https://example.com/features", lastModified: new Date() },
    { url: "https://example.com/guides", lastModified: new Date() },
    { url: "https://example.com/circuits", lastModified: new Date() },
    { url: "https://example.com/tools", lastModified: new Date() },
  ];
}
