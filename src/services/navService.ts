// import { api } from '../lib/api';
import type { NavItem } from '../types/nav';

/**
 * Fetches all navigation items
 */
export async function getNavItems(): Promise<NavItem[]> {
  // In a real app:
  // return await api.get<NavItem[]>('/navigation');
  
  // For now, return mock data
  return [
    {
      id: 1,
      title: 'Home',
      url: '/',
      order: 1,
      parentId: null,
    },
    {
      id: 2,
      title: 'About',
      url: '/about',
      order: 2,
      parentId: null,
    },
    {
      id: 3,
      title: 'Services',
      url: '/services',
      order: 3,
      parentId: null,
    },
    {
      id: 4,
      title: 'Contact',
      url: '/contact',
      order: 4,
      parentId: null,
    },
  ];
}

/**
 * Recursive function to organize flat nav items into a hierarchical structure
 */
export function organizeNavItems(items: NavItem[]): NavItem[] {
  // First, find all root-level items (parentId is null)
  const rootItems = items.filter(item => item.parentId === null);
  
  // Create a map for quick lookup by ID
  const itemMap = new Map<number, NavItem>();
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });
  
  // Add children to their parents
  items.forEach(item => {
    if (item.parentId !== null && itemMap.has(item.parentId)) {
      const parent = itemMap.get(item.parentId);
      if (parent && parent.children) {
        parent.children.push(itemMap.get(item.id) as NavItem);
      }
    }
  });
  
  // Return the organized root items with their children
  return rootItems.map(item => itemMap.get(item.id) as NavItem)
    .sort((a, b) => a.order - b.order);
} 