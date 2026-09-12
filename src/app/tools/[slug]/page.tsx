import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getToolBySlug, tools } from "@/data/tools";
import KwToHpCalculator from "@/components/tools/KwToHpCalculator";

type Props = {
  params: { slug: string };
};

// Build-time static params generate karta hai har tool ke liye
export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tool = getToolBySlug(params.slug);
  return {
    title: tool ? tool.title : "Tool not found",
    description: tool?.description,
  };
}

export default function ToolDetailPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-3 text-3xl font-bold">{tool.title}</h1>
      <p className="mb-8 text-gray-600">{tool.description}</p>

      {/*
        Pattern: har naye calculator ke liye src/components/tools/ me component banayein,
        yahan import karke slug ke hisaab se render kar dein (jaise neeche kw-to-hp ka example hai).
      */}
      {tool.slug === "kw-to-hp-calculator" ? (
        <KwToHpCalculator />
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-gray-500">
          Calculator UI abhi baaki hai ({tool.slug}).
        </div>
      )}
    </article>
  );
}
