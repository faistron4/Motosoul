// Guide data. Backend aane par API/DB call se replace karo.

export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: GuideCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  readTime: number; // minutes
  author: string;
  authorInitials: string;
  publishedAt: string;
  image: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
}

export type GuideCategory =
  | 'Wheels & Tyres'
  | 'Engine & Performance'
  | 'Maintenance'
  | 'Buying & Selling'
  | 'Track & Motorsport'
  | 'Detailing';

export const guideCategories: { name: GuideCategory; icon: string; count: number }[] = [
  { name: 'Wheels & Tyres', icon: 'fa-circle-dot', count: 8 },
  { name: 'Engine & Performance', icon: 'fa-gears', count: 12 },
  { name: 'Maintenance', icon: 'fa-wrench', count: 10 },
  { name: 'Buying & Selling', icon: 'fa-handshake', count: 6 },
  { name: 'Track & Motorsport', icon: 'fa-flag-checkered', count: 7 },
  { name: 'Detailing', icon: 'fa-spray-can-sparkles', count: 5 },
];

export const guides: Guide[] = [
  {
    id: '1',
    slug: 'wheel-offset-guide',
    title: 'Understanding Wheel Offset: The Complete Guide',
    excerpt: 'Offset is the single most misunderstood wheel spec. Learn how it affects fitment, handling, and whether your new wheels will actually fit.',
    category: 'Wheels & Tyres',
    difficulty: 'Beginner',
    readTime: 8,
    author: 'James Carter',
    authorInitials: 'JC',
    publishedAt: '2026-08-15',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Wheel+Offset',
    tags: ['Wheels', 'Fitment', 'Offset'],
    featured: true,
    popular: true,
  },
  {
    id: '2',
    slug: 'turbo-vs-supercharger',
    title: 'Turbo vs Supercharger: Which Is Right for Your Build?',
    excerpt: 'Both force more air into your engine — but they do it very differently. We break down power delivery, cost, complexity, and real-world driving.',
    category: 'Engine & Performance',
    difficulty: 'Intermediate',
    readTime: 12,
    author: 'Priya Sharma',
    authorInitials: 'PS',
    publishedAt: '2026-08-10',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Turbo+vs+SC',
    tags: ['Forced Induction', 'Turbo', 'Supercharger'],
    popular: true,
  },
  {
    id: '3',
    slug: 'diy-oil-change',
    title: 'How to Change Your Own Oil (Without Making a Mess)',
    excerpt: 'A step-by-step walkthrough of the most important DIY maintenance job. Save money and learn your car in the process.',
    category: 'Maintenance',
    difficulty: 'Beginner',
    readTime: 6,
    author: 'Tom Reeves',
    authorInitials: 'TR',
    publishedAt: '2026-08-05',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Oil+Change',
    tags: ['DIY', 'Oil', 'Maintenance'],
    popular: true,
  },
  {
    id: '4',
    slug: 'buying-used-car-checklist',
    title: 'The Used Car Buying Checklist Every Enthusiast Needs',
    excerpt: 'From cold-start checks to rust inspection, this is the exact process to follow before handing over your money.',
    category: 'Buying & Selling',
    difficulty: 'Beginner',
    readTime: 10,
    author: 'Maria Lopez',
    authorInitials: 'ML',
    publishedAt: '2026-07-28',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Used+Car',
    tags: ['Buying', 'Checklist', 'Inspection'],
  },
  {
    id: '5',
    slug: 'track-day-preparation',
    title: 'Track Day Preparation: What to Check Before You Go',
    excerpt: 'Brakes, fluids, tyres, and paperwork. Everything you need to sort before your first track day — and what you can leave at home.',
    category: 'Track & Motorsport',
    difficulty: 'Intermediate',
    readTime: 9,
    author: 'James Carter',
    authorInitials: 'JC',
    publishedAt: '2026-07-20',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Track+Day',
    tags: ['Track', 'Preparation', 'Safety'],
  },
  {
    id: '6',
    slug: 'engine-bay-detailing',
    title: 'Engine Bay Detailing: The Safe Way to Clean Under the Hood',
    excerpt: 'A clean engine bay makes maintenance easier and looks great at shows. Here\'s how to do it without frying your electronics.',
    category: 'Detailing',
    difficulty: 'Intermediate',
    readTime: 7,
    author: 'Priya Sharma',
    authorInitials: 'PS',
    publishedAt: '2026-07-15',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Engine+Detailing',
    tags: ['Detailing', 'Cleaning', 'Engine Bay'],
  },
  {
    id: '7',
    slug: 'tyre-size-explained',
    title: 'Tyre Size Explained: What 225/45R17 Actually Means',
    excerpt: 'Decode the numbers on your sidewall. Width, aspect ratio, construction, and rim diameter — all explained simply.',
    category: 'Wheels & Tyres',
    difficulty: 'Beginner',
    readTime: 5,
    author: 'Tom Reeves',
    authorInitials: 'TR',
    publishedAt: '2026-07-10',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Tyre+Size',
    tags: ['Tyres', 'Sizing', 'Basics'],
  },
  {
    id: '8',
    slug: 'ecu-remapping-guide',
    title: 'ECU Remapping: What It Is and What It Actually Does',
    excerpt: 'A remap can transform your car — or destroy it. Learn how ECU tuning works, what to expect, and how to choose a tuner.',
    category: 'Engine & Performance',
    difficulty: 'Advanced',
    readTime: 14,
    author: 'Maria Lopez',
    authorInitials: 'ML',
    publishedAt: '2026-07-05',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=ECU+Remap',
    tags: ['ECU', 'Tuning', 'Performance'],
  },
  {
    id: '9',
    slug: 'brake-pad-replacement',
    title: 'Brake Pad Replacement: A Beginner-Friendly Walkthrough',
    excerpt: 'Save hundreds on labour with this DIY brake pad guide. Tools, torque specs, and the mistakes to avoid.',
    category: 'Maintenance',
    difficulty: 'Intermediate',
    readTime: 11,
    author: 'Tom Reeves',
    authorInitials: 'TR',
    publishedAt: '2026-06-28',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Brake+Pads',
    tags: ['Brakes', 'DIY', 'Safety'],
    popular: true,
  },
];