import type { Metadata } from 'next';
import PowerToWeightCalculator from '@/components/tools/PowerToWeightCalculator';

export const metadata: Metadata = {
  title: 'Power to Weight Ratio Calculator | Formula, Examples & Comparison Guide',
  description: 'Calculate Power-to-Weight Ratio (PWR) instantly for cars, motorcycles, bikes, and rockets. Includes bidirectional calculations, acceleration estimates, real-world benchmarks, and an in-depth engineering guide.',
  keywords: ['Power to weight ratio calculator', 'PWR calculator', 'power to weight formula', 'horsepower per ton', 'W/kg calculator', 'hp per kg', 'acceleration estimator'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://example.com/tools/power-to-weight-ratio' },
  openGraph: {
    type: 'website',
    title: 'Power to Weight Ratio Calculator & Physics Guide',
    description: 'Calculate and analyze Power-to-Weight Ratios across cars, super bikes, and aircraft.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=PWR+Calculator+%26+Guide'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power to Weight Ratio Calculator & Physics Guide',
    description: 'Calculate and analyze Power-to-Weight Ratios across cars, super bikes, and aircraft.',
  },
};

export default function PowerToWeightRatioPage() {
  return <PowerToWeightCalculator />;
}