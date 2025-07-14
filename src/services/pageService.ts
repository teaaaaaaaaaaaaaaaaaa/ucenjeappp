// import { api } from '../lib/api';
import type { Page } from '../types/page';

/**
 * Fetches a page by its slug
 */
export async function getPageBySlug(slug: string): Promise<Page> {
  // In a real app:
  // return await api.get<Page>(`/pages/${slug}`);
  
  // For now, return mock data
  if (slug === 'not-found') {
    throw new Error('Page not found');
  }
  
  return {
    id: '123',
    title: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Page`,
    slug,
    content: `
      <h2>Welcome to the ${slug} page</h2>
      <p>This is a dynamic page that would normally load content from a CMS or database.</p>
      <p>The slug for this page is: <strong>${slug}</strong></p>
    `,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
  };
}

/**
 * Fetches all published pages
 */
export async function getPublishedPages(): Promise<Page[]> {
  // In a real app:
  // return await api.get<Page[]>('/pages?published=true');
  
  // For now, return mock data
  return [
    {
      id: '1',
      title: 'About',
      slug: 'about',
      content: '<p>About page content</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    },
    {
      id: '2',
      title: 'Contact',
      slug: 'contact',
      content: '<p>Contact page content</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    },
    {
      id: '3',
      title: 'Services',
      slug: 'services',
      content: '<p>Services page content</p>',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    },
  ];
} 