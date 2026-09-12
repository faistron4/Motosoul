import type { Metadata } from 'next';
import ComingSoon from '@/components/shared/ComingSoon';

export const metadata: Metadata = {
  title: 'Sign In — Coming Soon',
  description: 'Member sign in is coming soon.',
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <ComingSoon title="Sign In" icon="fa-right-to-bracket" />;
}