import type { Metadata } from 'next';
import DrivetrainLossCalculator from '@/components/tools/DrivetrainLossCalculator';

export const metadata: Metadata = {
  title: 'Drivetrain horsepower loss guestimator',
  description:
    "Estimate your drivetrain loss and calculate your engine's wheel horsepower.",
  alternates: {
    canonical: 'https://example.com/tools/drivetrain-horsepower-loss-guestimator',
  },
  openGraph: {
    type: 'website',
    title: 'Drivetrain horsepower loss guestimator',
    description:
      "Estimate your drivetrain loss and calculate your engine's wheel horsepower.",
    images: ['https://placehold.co/1200x630/0f172a/ffffff?text=Drivetrain+Loss'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drivetrain horsepower loss guestimator',
    description:
      "Estimate your drivetrain loss and calculate your engine's wheel horsepower.",
  },
};

export default function DrivetrainLossPage() {
  return <DrivetrainLossCalculator />;
}