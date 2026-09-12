import type { Metadata } from 'next';
import WheelFitmentCalculator from '@/components/tools/WheelFitmentCalculator';

export const metadata: Metadata = {
  title: 'Wheel & tyre fitment calculator',
  description:
    'Visualise different wheel and tyre options by comparing size, width and offset.',
  alternates: {
    canonical:
      'https://example.com/tools/wheel-and-tyre-fitment-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Wheel & tyre fitment calculator',
    description:
      'Visualise different wheel and tyre options by comparing size, width and offset.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Wheel+Fitment'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wheel & tyre fitment calculator',
    description:
      'Visualise different wheel and tyre options by comparing size, width and offset.',
  },
};

export default function WheelFitmentPage() {
  return <WheelFitmentCalculator />;
}