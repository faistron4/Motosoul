import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ComingSoon';

export const metadata: Metadata = {
  title: 'Join the Community — Coming Soon',
  description: 'Community sign-up is coming soon.',
  robots: { index: false, follow: false },
};

export default function CommunityPage() {
  return <ComingSoon title="Community Sign-Up" icon="fa-users" />;
}