// Base URL for API calls
const API_BASE_URL = import.meta.env.PROD
  ? 'https://api.example.com' 
  : 'http://localhost:3001';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: unknown;
}

/**
 * Handles API requests with standard error handling and response parsing
 */
export async function fetchApi<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // Sends cookies with cross-origin requests
  };
  
  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      // Attempt to parse error response
      let errorData;
      try {
        errorData = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    
    // Handle empty responses (like from DELETE operations)
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// Convenience methods for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: unknown, options?: Omit<FetchOptions, 'method'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: unknown, options?: Omit<FetchOptions, 'method'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body: unknown, options?: Omit<FetchOptions, 'method'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) => 
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
}; 