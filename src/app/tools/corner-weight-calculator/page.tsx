import type { Metadata } from 'next';
import CornerWeightCalculator from '@/components/tools/CornerWeightCalculator';

export const metadata: Metadata = {
  title: 'Corner weight calculator',
  description:
    "Calculate your car's corner weights and cross weights using our easy-to-use calculator.",
  alternates: {
    canonical: 'https://example.com/tools/corner-weight-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Corner weight calculator',
    description:
      "Calculate your car's corner weights and cross weights using our easy-to-use calculator.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Corner+Weight'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corner weight calculator',
    description:
      "Calculate your car's corner weights and cross weights using our easy-to-use calculator.",
  },
};

export default function CornerWeightPage() {
  return <CornerWeightCalculator />;
}