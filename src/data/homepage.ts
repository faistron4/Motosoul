export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
  slug: string;
}

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  category: string;
}

export interface Circuit {
  id: string;
  name: string;
  country: string;
  flag: string;
  length: string;
  corners: number;
  slug: string;
}

export interface BuildDiary {
  id: string;
  title: string;
  author: string;
  car: string;
  image: string;
  entries: number;
  slug: string;
}

export const featuredArticles: Article[] = [
  {
    id: '1',
    title: 'The Craziest Cars We Love to See on the Road',
    excerpt: 'From homologation specials to unhinged tuner builds, these are the machines that stop traffic.',
    category: 'Features',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Article+1',
    readTime: '8 min read',
    slug: 'craziest-cars',
  },
  {
    id: '2',
    title: 'Whatever Happened to the Caparo T1?',
    excerpt: 'The story of a Formula 1 car for the road that promised everything and delivered chaos.',
    category: 'Features',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Article+2',
    readTime: '6 min read',
    slug: 'caparo-t1',
  },
  {
    id: '3',
    title: '5 Underrated JDM Engines You Should Know',
    excerpt: 'Forget the 2JZ. These Japanese powerplants deserve way more credit than they get.',
    category: 'Guides',
    image: 'https://placehold.co/800x500/e2e8f0/475569?text=Article+3',
    readTime: '10 min read',
    slug: 'underrated-jdm-engines',
  },
];

export const toolsList: ToolItem[] = [
  { id: '1', title: 'Power-to-weight Calculator', description: 'Compare power vs. weight and see which setup delivers the best performance.', icon: 'fa-gauge-high', slug: 'power-to-weight-calculator', category: 'Performance' },
  { id: '2', title: 'Corner Weight Calculator', description: "Calculate your car's corner weights and cross weights with ease.", icon: 'fa-scale-balanced', slug: 'corner-weight-calculator', category: 'Setup' },
  { id: '3', title: 'Engine Displacement', description: 'Quickly calculate displacement using bore, stroke, and cylinder count.', icon: 'fa-gears', slug: 'engine-displacement-calculator', category: 'Engine' },
  { id: '4', title: 'Turbo Boost Pressure', description: 'Calculate required boost pressure given N/A power and target HP.', icon: 'fa-fan', slug: 'turbo-boost-pressure-calculator', category: 'Forced Induction' },
  { id: '5', title: 'Wheel & Tyre Fitment', description: 'Visualise wheel and tyre options by comparing size, width, and offset.', icon: 'fa-circle-dot', slug: 'wheel-and-tyre-fitment-calculator', category: 'Fitment' },
  { id: '6', title: 'Vehicle Speed', description: 'Calculate top speed in each gear using gear ratio, RPM, and tire size.', icon: 'fa-gauge', slug: 'vehicle-speed-calculator', category: 'Performance' },
];

export const circuitsList: Circuit[] = [
  { id: '1', name: 'Nürburgring Nordschleife', country: 'Germany', flag: '🇩🇪', length: '20.8 km', corners: 154, slug: 'nurburgring' },
  { id: '2', name: 'Spa-Francorchamps', country: 'Belgium', flag: '🇧🇪', length: '7.004 km', corners: 19, slug: 'spa' },
  { id: '3', name: 'Circuit de Monaco', country: 'Monaco', flag: '🇲🇨', length: '3.337 km', corners: 19, slug: 'monaco' },
  { id: '4', name: 'Silverstone Circuit', country: 'UK', flag: '🇬🇧', length: '5.891 km', corners: 18, slug: 'silverstone' },
];

export const buildDiaries: BuildDiary[] = [
  { id: '1', title: 'Mazda RX7 FD', author: '@armonb', car: '1993 Mazda RX-7 FD', image: 'https://placehold.co/600x400/e2e8f0/475569?text=RX7+Build', entries: 12, slug: 'mazda-rx7-fd' },
  { id: '2', title: 'Nissan Skyline R34', author: '@gearhead', car: '1999 Nissan Skyline GT-R', image: 'https://placehold.co/600x400/e2e8f0/475569?text=Skyline+Build', entries: 8, slug: 'skyline-r34' },
  { id: '3', title: 'Honda Civic EK9', author: '@jdmfan', car: '1997 Honda Civic Type R', image: 'https://placehold.co/600x400/e2e8f0/475569?text=Civic+Build', entries: 15, slug: 'civic-ek9' },
];