import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  author: string;
  coverImage?: string;
  draft: boolean;
}

function getBlogPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => {
      const fullPath = path.join(dir, file);
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      return {
        slug: data.slug || file.replace(/\.mdx?$/, ''),
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        category: data.category || 'General',
        publishedAt: data.publishedAt || '',
        author: data.author || 'Motosoul Team',
        coverImage: data.coverImage,
        draft: data.draft ?? false,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
            <i className="fa-solid fa-newspaper" /> Motosoul Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            Stories, <span className="text-blue-600">insights</span> &amp; engineering deep dives.
          </h1>
          <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
            Long-form writing from the Motosoul team and contributors.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <i className="fa-solid fa-inbox text-4xl mb-3 text-slate-300" />
            <p className="text-sm font-semibold">No blog posts yet.</p>
            <p className="text-xs mt-1">Sign in to /admin to create your first post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-900 hover:shadow-lg transition-all duration-300"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{post.category}</span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug mt-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>{post.author}</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}