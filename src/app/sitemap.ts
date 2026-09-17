import type { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { tools } from '@/data/tools';
import { circuits } from '@/data/circuits';
import { features } from '@/data/features';
import { guides } from '@/data/guides';

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
  { path: '/tools', priority: 0.95, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.85, changeFrequency: 'daily' },
  { path: '/guides', priority: 0.85, changeFrequency: 'weekly' },
  { path: '/circuits', priority: 0.80, changeFrequency: 'weekly' },
  { path: '/blog', priority: 0.85, changeFrequency: 'daily' },  // ← 🆕 Blog listing
  { path: '/contact-us', priority: 0.50, changeFrequency: 'monthly' },
  { path: '/terms-and-conditions', priority: 0.30, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.30, changeFrequency: 'yearly' },
];

/* ---------- BLOG POSTS FROM CMS ---------- */
function getBlogPosts(): {
  slug: string;
  publishedAt: string;
  seo?: {
    priority?: number;
    changeFrequency?: string;
    noindex?: boolean;
  };
}[] {
  const dir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((file) => {
      const { data } = matter(
        fs.readFileSync(path.join(dir, file), 'utf8')
      );
      return {
        slug: data.slug || file.replace(/\.mdx?$/, ''),
        publishedAt: data.publishedAt || new Date().toISOString().split('T')[0],
        seo: data.seo || {},
      };
    })
    /* Agar post ka `draft: true` ya `seo.noindex: true` hai, toh sitemap me nahi jaayega */
    .filter((post) => {
      const { data } = matter(
        fs.readFileSync(
          path.join(dir, fs.readdirSync(dir).find((f) => {
            const fullPath = path.join(dir, f);
            const { data: d } = matter(fs.readFileSync(fullPath, 'utf8'));
            return (d.slug || f.replace(/\.mdx?$/, '')) === post.slug;
          }) || ''),
          'utf8'
        )
      );
      return !data.draft && !(data.seo?.noindex === true);
    });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  /* Static pages */
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  /* Tools */
  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  /* Features */
  const featureEntries: MetadataRoute.Sitemap = features.map((feature) => ({
    url: `${BASE_URL}/features/${feature.slug}`,
    lastModified: new Date(feature.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  /* Guides */
  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  /* Circuits */
  const circuitEntries: MetadataRoute.Sitemap = circuits.map((circuit) => ({
    url: `${BASE_URL}/circuits/${circuit.countryCode.toLowerCase()}/${circuit.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  /* Blog posts — from CMS */
  const blogPosts = getBlogPosts();
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency:
      (post.seo?.changeFrequency as MetadataRoute.Sitemap[number]['changeFrequency']) ||
      'monthly',
    priority: post.seo?.priority ?? 0.8,
  }));

  return [
    ...staticEntries,
    ...toolEntries,
    ...featureEntries,
    ...guideEntries,
    ...circuitEntries,
    ...blogEntries,
  ];
}