export type Feature = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: string;
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
};

export type Circuit = {
  slug: string;
  country: string;
  countryCode: string;
  name: string;
  location: string;
  length: string;
  trackdaysAvailable: boolean;
};

export type Tool = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
};