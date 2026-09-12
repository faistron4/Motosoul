import type { Metadata } from 'next';
import Link from 'next/link';
import TermsTOC from '@/components/shared/TermsTOC';
import BackToTopButton from '@/components/shared/BackToTopButton';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Read the terms and conditions for using Motoristo. Understand your rights and responsibilities when accessing our website, tools, and community features.',
  alternates: {
    canonical: 'https://example.com/terms-and-conditions',
  },
  openGraph: {
    type: 'website',
    title: 'Terms & Conditions | Motoristo',
    description:
      'Read the terms and conditions for using Motoristo. Understand your rights and responsibilities.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Terms+%26+Conditions'],
  },
};

const LAST_UPDATED = '12 September 2026';

export default function TermsPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">

      {/* ==================================================== */}
      {/* HERO */}
      {/* ==================================================== */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
              <i className="fa-solid fa-file-contract" />
              Legal
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-4 text-slate-900">
              Terms &amp; Conditions
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-2xl">
              These terms set out the rules for using Motoristo. By accessing or using
              our website, tools, or community features, you agree to be bound by them.
              Please read them carefully.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <i className="fa-regular fa-calendar text-blue-600" />
                Last updated: <strong className="text-slate-700">{LAST_UPDATED}</strong>
              </span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="flex items-center gap-1.5">
                <i className="fa-regular fa-clock text-blue-600" />
                ~8 min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* MAIN CONTENT + SIDEBAR */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Sidebar TOC (desktop only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <i className="fa-solid fa-list text-blue-600" />
                On This Page
              </h3>
              <TermsTOC />
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-9 article-content max-w-none">

            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">1.</span> Introduction
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Welcome to Motoristo. These Terms &amp; Conditions (&quot;Terms&quot;)
                govern your access to and use of the Motoristo website, mobile
                applications, tools, and any related services (collectively, the
                &quot;Platform&quot;).
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                By accessing or using the Platform, you confirm that you have read,
                understood, and agree to be bound by these Terms. If you do not agree
                with any part of these Terms, you must not use the Platform.
              </p>
            </section>

            {/* 2. About These Terms */}
            <section id="about-these-terms" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">2.</span> About These Terms
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                These Terms apply to all visitors, users, and others who access the
                Platform. They should be read alongside our Privacy Policy and Cookie
                Policy, which also govern your use of the Platform.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We may update these Terms from time to time. When we do, we will revise
                the &quot;Last updated&quot; date at the top of this page. Your continued
                use of the Platform after any changes constitutes acceptance of the
                updated Terms.
              </p>
            </section>

            {/* 3. Your Use of the Site */}
            <section id="your-use" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">3.</span> Your Use of the Site
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                The Platform is provided for personal, non-commercial use. You may
                access and use the Platform for lawful purposes only. You agree not to:
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed space-y-2 list-disc pl-5 mb-3">
                <li>Use the Platform in any way that breaches applicable laws or regulations.</li>
                <li>Attempt to gain unauthorised access to any part of the Platform.</li>
                <li>Interfere with the proper working of the Platform or its servers.</li>
                <li>Use automated systems (bots, scrapers) to access the Platform without our written consent.</li>
                <li>Upload or transmit any malicious code, virus, or harmful material.</li>
                <li>Impersonate any person or misrepresent your affiliation with any entity.</li>
              </ul>
              <p className="text-slate-600 text-sm leading-relaxed">
                We reserve the right to restrict or terminate your access to the
                Platform if we reasonably believe you have breached these Terms.
              </p>
            </section>

            {/* 4. User Content */}
            <section id="user-content" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">4.</span> User Content &amp; Contributions
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Some parts of the Platform may allow you to submit content, including
                comments, reviews, build diaries, and photographs (&quot;User
                Content&quot;). By submitting User Content, you confirm that:
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed space-y-2 list-disc pl-5 mb-3">
                <li>You own the rights to the content or have permission to share it.</li>
                <li>The content does not infringe any third-party rights, including copyright and privacy.</li>
                <li>The content is accurate, not misleading, and not unlawful.</li>
                <li>You have obtained consent from any identifiable individuals featured in the content.</li>
              </ul>
              <p className="text-slate-600 text-sm leading-relaxed">
                By submitting User Content, you grant us a non-exclusive, royalty-free,
                worldwide licence to use, reproduce, publish, and display that content
                on the Platform. We may remove any User Content at our discretion.
              </p>
            </section>

            {/* 5. Intellectual Property */}
            <section id="intellectual-property" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">5.</span> Intellectual Property
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                All content on the Platform—including design, text, graphics, logos,
                icons, and software—is owned by Motoristo or its licensors and is
                protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                You may not copy, reproduce, distribute, modify, or republish any part
                of the Platform without our prior written consent, except for personal,
                non-commercial use.
              </p>
            </section>

            {/* 6. Your Account */}
            <section id="your-account" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">6.</span> Your Account
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                If you create an account on the Platform, you are responsible for:
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed space-y-2 list-disc pl-5 mb-3">
                <li>Providing accurate, current, and complete information.</li>
                <li>Keeping your password confidential and secure.</li>
                <li>All activity that occurs under your account.</li>
                <li>Notifying us immediately of any unauthorised use.</li>
              </ul>
              <p className="text-slate-600 text-sm leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate
                these Terms or that we reasonably believe pose a risk to the Platform
                or other users.
              </p>
            </section>

            {/* 7. Privacy & Cookies */}
            <section id="privacy" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">7.</span> Privacy &amp; Cookies
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                We take your privacy seriously. Our use of your personal information
                is governed by our Privacy Policy, which explains what data we collect,
                how we use it, and your rights.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                We also use cookies and similar technologies to improve your
                experience. For full details, please see our Cookie Policy.
              </p>
            </section>

            {/* 8. Third-Party Links */}
            <section id="third-party" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">8.</span> Third-Party Links
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                The Platform may contain links to third-party websites, services, or
                resources. These links are provided for convenience only. We do not
                control, endorse, or take responsibility for the content, privacy
                practices, or accuracy of any third-party sites.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                You access third-party links at your own risk. We encourage you to
                review the terms and privacy policies of any third-party site you visit.
              </p>
            </section>

            {/* 9. Disclaimers */}
            <section id="disclaimers" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">9.</span> Disclaimers
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                The Platform and all content, tools, and calculators are provided on
                an &quot;as is&quot; and &quot;as available&quot; basis. We make no
                warranties, express or implied, regarding:
              </p>
              <ul className="text-slate-600 text-sm leading-relaxed space-y-2 list-disc pl-5 mb-3">
                <li>The accuracy, completeness, or reliability of any content.</li>
                <li>The suitability of the Platform for any particular purpose.</li>
                <li>Uninterrupted or error-free operation of the Platform.</li>
              </ul>
              <p className="text-slate-600 text-sm leading-relaxed">
                Information on the Platform is for general guidance only and should
                not be relied upon as professional, legal, or engineering advice.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="liability" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">10.</span> Limitation of Liability
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                To the fullest extent permitted by law, Motoristo and its directors,
                employees, and partners shall not be liable for any indirect,
                incidental, or consequential loss or damage arising from your use of,
                or inability to use, the Platform.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Nothing in these Terms excludes or limits our liability for death or
                personal injury caused by negligence, fraud, or any other liability
                that cannot be lawfully excluded.
              </p>
            </section>

            {/* 11. Changes */}
            <section id="changes" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">11.</span> Changes to These Terms
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                We may revise these Terms at any time. When we make changes, we will
                update the &quot;Last updated&quot; date at the top of this page.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your continued use of the Platform after any changes means you accept
                the revised Terms. We encourage you to check this page periodically.
              </p>
            </section>

            {/* 12. Contact */}
            <section id="contact" className="scroll-mt-24 mb-10">
              <h2 className="text-xl font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-baseline gap-2">
                <span className="text-blue-600">12.</span> Contact Us
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors"
              >
                <i className="fa-solid fa-envelope text-xs" />
                Contact Us
              </Link>
            </section>

          {/* Back to Top */}
<div className="pt-6 border-t border-slate-100">
  <BackToTopButton />
</div>

          </article>
        </div>
      </section>

    </div>
  );
}