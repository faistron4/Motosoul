import type { Metadata } from 'next';
import TurboBoostCalculator from '@/components/tools/TurboBoostCalculator';

export const metadata: Metadata = {
  title: 'Turbo boost pressure calculator',
  description:
    'Calculate the required turbo boost pressure for your engine given N/A power and target HP.',
  alternates: {
    canonical: 'https://example.com/tools/turbo-boost-pressure-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Turbo boost pressure calculator',
    description:
      'Calculate the required turbo boost pressure for your engine given N/A power and target HP.',
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Turbo+Boost'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turbo boost pressure calculator',
    description:
      'Calculate the required turbo boost pressure for your engine given N/A power and target HP.',
  },
};

export default function TurboBoostPage() {
  return <TurboBoostCalculator />;
}