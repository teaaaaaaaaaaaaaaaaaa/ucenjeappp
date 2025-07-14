import { useState, useEffect } from 'react';
import type { NavItem } from '../types/nav';

const useNavItems = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        // In a real application, this would be fetched from an API
        // For now, we'll use mock data
        const mockNavItems: NavItem[] = [
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
            title: 'Contact',
            url: '/contact',
            order: 3,
            parentId: null,
          },
        ];
        
        setNavItems(mockNavItems);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch nav items'));
        setLoading(false);
      }
    };

    fetchNavItems();
  }, []);

  return { navItems, loading, error };
};

export default useNavItems; 