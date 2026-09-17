import type { MetadataRoute } from 'next';
import { tools } from '@/data/tools';
import { circuits } from '@/data/circuits';
import { features } from '@/data/features';
import { guides } from '@/data/guides';

/* ---------- BASE URL ---------- */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://your-domain.com';

/* ---------- STATIC PAGES ---------- */
const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}[] = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },

  /* Tools — HIGHEST priority */
  { path: '/tools', priority: 0.95, changeFrequency: 'weekly' },

  /* Content hubs */
  { path: '/features', priority: 0.85, changeFrequency: 'daily' },
  { path: '/guides', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/circuits', priority: 0.80, changeFrequency: 'weekly' },

  /* Contact */
  { path: '/contact-us', priority: 0.50, changeFrequency: 'monthly' },

  /* Legal */
  { path: '/terms-and-conditions', priority: 0.30, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.30, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* ---- Static pages ---- */
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  /* ---- Tool detail pages (HIGH priority — 0.9) ---- */
  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  /* ---- Feature articles (0.75) ---- */
  const featureEntries: MetadataRoute.Sitemap = features.map((feature) => ({
    url: `${BASE_URL}/features/${feature.slug}`,
    lastModified: new Date(feature.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  /* ---- Guide articles (0.75) ---- */
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  /* ---- Circuit detail pages (0.7) ---- */
  const circuitEntries: MetadataRoute.Sitemap = circuits.map((circuit) => ({
    url: `${BASE_URL}/circuits/${circuit.countryCode.toLowerCase()}/${circuit.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...toolEntries,
    ...featureEntries,
    ...guideEntries,
    ...circuitEntries,
  ];
}