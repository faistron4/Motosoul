import type { Metadata } from 'next';
import DynoCorrectionCalculator from '@/components/tools/DynoCorrectionCalculator';

export const metadata: Metadata = {
  title: 'Dyno correction calculator',
  description:
    "Correct your engine's power output for different atmospheric conditions.",
  alternates: {
    canonical: 'https://example.com/tools/dyno-correction-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Dyno correction calculator',
    description:
      "Correct your engine's power output for different atmospheric conditions.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Dyno+Correction'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dyno correction calculator',
    description:
      "Correct your engine's power output for different atmospheric conditions.",
  },
};

export default function DynoCorrectionPage() {
  return <DynoCorrectionCalculator />;
}