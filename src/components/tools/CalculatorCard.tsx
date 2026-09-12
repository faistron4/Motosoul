import Link from "next/link";
import { Tool } from "@/types";

type CalculatorCardProps = {
  tool: Tool;
};

export default function CalculatorCard({ tool }: CalculatorCardProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block rounded-lg border border-gray-200 p-5 transition hover:border-gray-400 hover:shadow-md"
    >
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{tool.title}</h3>
      <p className="text-sm text-gray-600">{tool.description}</p>
    </Link>
  );
}
