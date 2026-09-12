// Feature article data. Backend aane par API/DB call se replace karo.

export interface Feature {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: FeatureCategory;
  readTime: number;
  author: string;
  authorInitials: string;
  publishedAt: string;
  image: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
}

export type FeatureCategory =
  | 'Car Culture'
  | 'Motorsport'
  | 'Engineering'
  | 'History'
  | 'Road Trips'
  | 'Ownership';

export const featureCategories: { name: FeatureCategory; icon: string; count: number }[] = [
  { name: 'Car Culture', icon: 'fa-fire', count: 14 },
  { name: 'Motorsport', icon: 'fa-flag-checkered', count: 11 },
  { name: 'Engineering', icon: 'fa-microchip', count: 9 },
  { name: 'History', icon: 'fa-clock-rotate-left', count: 8 },
  { name: 'Road Trips', icon: 'fa-route', count: 7 },
  { name: 'Ownership', icon: 'fa-key', count: 10 },
];

export const features: Feature[] = [
  {
    id: '1',
    slug: 'the-golden-era-of-japanese-turbos',
    title: 'The Golden Era of Japanese Turbos: Why the 90s Still Can\'t Be Beaten',
    excerpt: 'From the RB26DETT to the 2JZ-GTE, the 1990s gave us a wave of turbocharged icons that shaped car culture forever. We explore why no era since has matched that magic.',
    category: 'Car Culture',
    readTime: 12,
    author: 'Hassan Raza',
    authorInitials: 'HR',
    publishedAt: '2026-08-20',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=JDM+Turbos',
    tags: ['JDM', 'Turbos', '90s'],
    featured: true,
    trending: true,
  },
  {
    id: '2',
    slug: 'how-f1-brakes-actually-work',
    title: 'How F1 Brakes Actually Work: 1,000°C and Still Stopping',
    excerpt: 'Carbon-carbon brakes glow orange and can haul a car from 200 mph in under 4 seconds. Here\'s the science behind the most extreme braking systems on earth.',
    category: 'Engineering',
    readTime: 9,
    author: 'Ayesha Khan',
    authorInitials: 'AK',
    publishedAt: '2026-08-18',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=F1+Brakes',
    tags: ['F1', 'Brakes', 'Engineering'],
    trending: true,
  },
  {
    id: '3',
    slug: 'the-man-who-built-ferrari',
    title: 'Enzo Ferrari: The Man Who Turned Racing Into a Religion',
    excerpt: 'Before the road cars, before the fame, there was a stubborn racer from Modena with a vision. This is the story of how one man built an empire from pure obsession.',
    category: 'History',
    readTime: 15,
    author: 'Bilal Ahmed',
    authorInitials: 'BA',
    publishedAt: '2026-08-15',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Enzo+Ferrari',
    tags: ['Ferrari', 'History', 'Enzo'],
  },
  {
    id: '4',
    slug: 'the-best-driving-roads-in-the-world',
    title: 'The 10 Best Driving Roads in the World (And How to Find Your Own)',
    excerpt: 'From the Transfăgărășan to the Tail of the Dragon, these roads aren\'t just about scenery — they\'re about the drive. Plus tips for finding hidden gems near you.',
    category: 'Road Trips',
    readTime: 11,
    author: 'Sarah Malik',
    authorInitials: 'SM',
    publishedAt: '2026-08-12',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Driving+Roads',
    tags: ['Roads', 'Travel', 'Driving'],
    trending: true,
  },
  {
    id: '5',
    slug: 'the-rise-of-electric-hot-hatches',
    title: 'The Rise of Electric Hot Hatches: Fun Without the Fuel',
    excerpt: 'Cars like the MG4 XPower and Cupra Born prove that EVs can be genuinely exciting. We look at how electric performance is reshaping the affordable fun car.',
    category: 'Car Culture',
    readTime: 8,
    author: 'Hassan Raza',
    authorInitials: 'HR',
    publishedAt: '2026-08-08',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=EV+Hot+Hatch',
    tags: ['EV', 'Hot Hatch', 'Performance'],
  },
  {
    id: '6',
    slug: 'why-manual-gearboxes-refuse-to-die',
    title: 'Why Manual Gearboxes Refuse to Die (And Why That Matters)',
    excerpt: 'By every metric, the manual should be extinct. Yet it survives — and in some corners, it\'s thriving. A look at the stick shift\'s unlikely comeback.',
    category: 'Ownership',
    readTime: 7,
    author: 'Ayesha Khan',
    authorInitials: 'AK',
    publishedAt: '2026-08-05',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Manual+Gearbox',
    tags: ['Manual', 'Gearbox', 'Driving'],
  },
  {
    id: '7',
    slug: 'group-b-the-greatest-era-of-rallying',
    title: 'Group B: The Greatest Era of Rallying Ever (And Why It Ended)',
    excerpt: '1,000 bhp rally cars, crowds inches from the road, and a tragedy that changed everything. Group B was the wildest motorsport era ever — and it lasted just five years.',
    category: 'Motorsport',
    readTime: 13,
    author: 'Bilal Ahmed',
    authorInitials: 'BA',
    publishedAt: '2026-08-01',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Group+B',
    tags: ['Rally', 'Group B', 'History'],
    trending: true,
  },
  {
    id: '8',
    slug: 'the-anatomy-of-a-crash-test',
    title: 'The Anatomy of a Crash Test: What Really Happens in 0.1 Seconds',
    excerpt: 'Modern cars are designed to crumple in specific ways to save your life. We break down what happens during a crash test — and why every millisecond matters.',
    category: 'Engineering',
    readTime: 10,
    author: 'Sarah Malik',
    authorInitials: 'SM',
    publishedAt: '2026-07-28',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Crash+Test',
    tags: ['Safety', 'Crash Test', 'Engineering'],
  },
  {
    id: '9',
    slug: 'the-art-of-barn-find-restoration',
    title: 'The Art of the Barn Find: How to Spot a Hidden Classic',
    excerpt: 'That dusty shape under a tarp could be worth a fortune — or a money pit. We talk to restorers about what to look for and when to walk away.',
    category: 'Ownership',
    readTime: 9,
    author: 'Bilal Ahmed',
    authorInitials: 'BA',
    publishedAt: '2026-07-25',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Barn+Find',
    tags: ['Restoration', 'Classic Cars', 'Buying'],
  },
  {
    id: '10',
    slug: 'how-aerodynamics-shape-modern-cars',
    title: 'How Aerodynamics Shape Modern Cars (Whether You See It or Not)',
    excerpt: 'Every curve, vent, and diffuser on a modern car is there for a reason. We explain the invisible forces that engineers fight at 200 mph.',
    category: 'Engineering',
    readTime: 11,
    author: 'Hassan Raza',
    authorInitials: 'HR',
    publishedAt: '2026-07-20',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Aerodynamics',
    tags: ['Aero', 'Engineering', 'Design'],
  },
];