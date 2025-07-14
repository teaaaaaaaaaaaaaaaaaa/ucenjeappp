// import { api } from '../lib/api';
import type { Option } from '../types/option';

/**
 * Fetches a specific option by key
 */
export async function getOption(key: string): Promise<Option | null> {
  // In a real app:
  // return await api.get<Option>(`/options/${key}`);
  
  // For now, return mock data based on key
  const mockOptions: Record<string, Option> = {
    'site_title': {
      id: 1,
      key: 'site_title',
      value: 'RDPR Website',
      autoload: true,
    },
    'site_description': {
      id: 2,
      key: 'site_description',
      value: 'RDPR Company Website',
      autoload: true,
    },
    'contact_email': {
      id: 3,
      key: 'contact_email',
      value: 'info@rdpr.example.com',
      autoload: true,
    },
    'contact_phone': {
      id: 4,
      key: 'contact_phone',
      value: '+1 (555) 123-4567',
      autoload: true,
    },
  };
  
  return mockOptions[key] || null;
}

/**
 * Fetches all autoload options
 */
export async function getAutoloadOptions(): Promise<Record<string, string>> {
  // In a real app:
  // const options = await api.get<Option[]>('/options?autoload=true');
  // return options.reduce((acc, option) => ({
  //   ...acc,
  //   [option.key]: option.value,
  // }), {});
  
  // For now, return mock data
  return {
    'site_title': 'RDPR Website',
    'site_description': 'RDPR Company Website',
    'contact_email': 'info@rdpr.example.com',
    'contact_phone': '+1 (555) 123-4567',
    'footer_text': '© 2023 RDPR. All rights reserved.',
    'social_facebook': 'https://facebook.com/rdpr',
    'social_twitter': 'https://twitter.com/rdpr',
    'social_instagram': 'https://instagram.com/rdpr',
  };
} 