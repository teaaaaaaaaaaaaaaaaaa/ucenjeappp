/**
 * A lightweight utility for conditionally joining class names together
 */
export function cn(...classes: (string | boolean | null | undefined)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
} 