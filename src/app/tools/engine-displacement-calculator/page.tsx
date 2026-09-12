import type { Metadata } from 'next';
import EngineDisplacementCalculator from '@/components/tools/EngineDisplacementCalculator';

export const metadata: Metadata = {
  title: 'Engine displacement calculator',
  description:
    "Quickly calculate your engine's displacement using bore size, stroke length, and cylinder count.",
  alternates: {
    canonical: 'https://example.com/tools/engine-displacement-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Engine displacement calculator',
    description:
      "Quickly calculate your engine's displacement using bore size, stroke length, and cylinder count.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Engine+Displacement'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engine displacement calculator',
    description:
      "Quickly calculate your engine's displacement using bore size, stroke length, and cylinder count.",
  },
};

export default function EngineDisplacementPage() {
  return <EngineDisplacementCalculator />;
}