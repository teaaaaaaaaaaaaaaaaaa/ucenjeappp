/**
 * Simple HTML sanitizer to prevent XSS attacks
 * In a real app, use a library like DOMPurify or sanitize-html
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // This is a very basic implementation
  // For production, use a proper sanitizer library
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders safe HTML
 * Use this with React's dangerouslySetInnerHTML only when necessary
 */
export function createSafeHtml(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
} 