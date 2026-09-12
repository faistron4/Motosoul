import type { Metadata } from 'next';
import VehicleSpeedCalculator from '@/components/tools/VehicleSpeedCalculator';

export const metadata: Metadata = {
  title: 'Vehicle speed calculator',
  description:
    "Calculate your vehicle's top speed in each gear by entering gear ratio, RPM, and tire size.",
  alternates: {
    canonical: 'https://example.com/tools/vehicle-speed-calculator',
  },
  openGraph: {
    type: 'website',
    title: 'Vehicle speed calculator',
    description:
      "Calculate your vehicle's top speed in each gear by entering gear ratio, RPM, and tire size.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Vehicle+Speed'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vehicle speed calculator',
    description:
      "Calculate your vehicle's top speed in each gear by entering gear ratio, RPM, and tire size.",
  },
};

export default function VehicleSpeedPage() {
  return <VehicleSpeedCalculator />;
}