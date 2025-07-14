export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
} 