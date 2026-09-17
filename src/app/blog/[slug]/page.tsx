import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

/* ---------- SITE URL ---------- */
const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://your-domain.com';

/* ---------- GET POST HELPER ---------- */
function getPost(slug: string) {
  const dir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir);
  const file = files.find((f) => {
    const fullPath = path.join(dir, f);
    const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
    return (data.slug || f.replace(/\.mdx?$/, '')) === slug;
  });

  if (!file) return null;
  const { data, content } = matter(
    fs.readFileSync(path.join(dir, file), 'utf8')
  );
  return { frontmatter: data, content };
}

/* ---------- SEO METADATA ---------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug);
  if (!post) {
    return { title: 'Post Not Found' };
  }

  const fm = post.frontmatter;
  const seo = fm.seo || {};

  const title = seo.metaTitle || fm.title || 'Blog Post';
  const description = seo.metaDescription || fm.excerpt || '';
  const image = seo.ogImage || fm.coverImage;
  const url = `${BASE_URL}/blog/${params.slug}`;

  return {
    title,
    description,
    keywords: seo.keywords || fm.tags || [],
    alternates: {
      canonical: seo.canonicalUrl || url,
    },
    robots: seo.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Motosoul',
      images: image ? [{ url: image }] : undefined,
      publishedTime: fm.publishedAt,
      authors: fm.author ? [fm.author] : undefined,
    },
    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') || 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
    other: {
      ...(fm.publishedAt && { 'article:published_time': fm.publishedAt }),
      ...(fm.author && { 'article:author': fm.author }),
    },
  };
}

/* ---------- STATIC PARAMS ---------- */
export async function generateStaticParams() {
  const dir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const { data } = matter(
        fs.readFileSync(path.join(dir, f), 'utf8')
      );
      return { slug: data.slug || f.replace(/\.mdx?$/, '') };
    });
}

/* ---------- PAGE COMPONENT ---------- */
export default function BlogPostPage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const { frontmatter, content } = post;

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Link
            href="/blog"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-6 transition-colors w-fit"
          >
            <i className="fa-solid fa-arrow-left" /> Back to Blog
          </Link>
          <span className="inline-block text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3">
            {frontmatter.category}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed mb-6">
            {frontmatter.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-user" /> {frontmatter.author}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="fa-regular fa-calendar" /> {frontmatter.publishedAt}
            </span>
          </div>
        </div>
      </section>

      {frontmatter.coverImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
            <img
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 article-content">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
}