import type { Metadata } from "next";
import CalculatorCard from "@/components/tools/CalculatorCard";
import { tools } from "@/data/tools";

export const metadata: Metadata = {
  title: "Tools & Calculators",
  description:
    "Motoring calculators and tools: power, torque, gearing, fitment aur bohat kuch.",
};

export default function ToolsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold">Tools & Calculators</h1>
      <p className="mb-8 text-gray-600">
        Car enthusiasts ke liye easy-to-use motoring calculators.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <CalculatorCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
