import type { Metadata } from 'next';
import KwToHpCalculator from '@/components/tools/KwToHpCalculator';

export const metadata: Metadata = {
  title: 'KW to HP calculator',
  description:
    'Convert kilowatts (kW) to horsepower (HP) and HP to kW with our easy-to-use power calculator.',
  alternates: {
    canonical: 'https://example.com/tools/kw-to-hp-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'KW to HP calculator',
    description:
      'Convert kilowatts (kW) to horsepower (HP) and HP to kW with our easy-to-use power calculator.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=kW+to+HP'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KW to HP calculator',
    description:
      'Convert kilowatts (kW) to horsepower (HP) and HP to kW with our easy-to-use power calculator.',
  },
};

export default function KwToHpPage() {
  return <KwToHpCalculator />;
}