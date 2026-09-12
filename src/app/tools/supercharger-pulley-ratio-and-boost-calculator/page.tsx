import type { Metadata } from 'next';
import SuperchargerCalculator from '@/components/tools/SuperchargerCalculator';

export const metadata: Metadata = {
  title: 'Supercharger pulley ratio and boost calculator',
  description:
    'Optimize your supercharger setup — estimate boost levels, RPM limits, and performance gains.',
  alternates: {
    canonical:
      'https://example.com/tools/supercharger-pulley-ratio-and-boost-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Supercharger pulley ratio and boost calculator',
    description:
      'Optimize your supercharger setup — estimate boost levels, RPM limits, and performance gains.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Supercharger+Calculator'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supercharger pulley ratio and boost calculator',
    description:
      'Optimize your supercharger setup — estimate boost levels, RPM limits, and performance gains.',
  },
};

export default function SuperchargerPage() {
  return <SuperchargerCalculator />;
}