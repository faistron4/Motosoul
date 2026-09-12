import type { Metadata } from 'next';
import TorqueToHpCalculator from '@/components/tools/TorqueToHpCalculator';

export const metadata: Metadata = {
  title: 'Torque to horsepower calculator',
  description:
    "Find your engine's power output. Just enter torque (lb-ft) and RPM for instant results.",
  alternates: {
    canonical: 'https://example.com/tools/torque-to-horsepower-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Torque to horsepower calculator',
    description:
      "Find your engine's power output. Just enter torque (lb-ft) and RPM for instant results.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Torque+to+HP'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Torque to horsepower calculator',
    description:
      "Find your engine's power output. Just enter torque (lb-ft) and RPM for instant results.",
  },
};

export default function TorqueToHpPage() {
  return <TorqueToHpCalculator />;
}