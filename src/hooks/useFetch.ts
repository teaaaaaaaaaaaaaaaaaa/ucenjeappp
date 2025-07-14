import { useState, useEffect } from 'react';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseFetchOptions {
  enabled?: boolean;
  headers?: HeadersInit;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
}

function useFetch<T>(url: string, options: UseFetchOptions = {}) {
  const { enabled = true, headers, method = 'GET', body } = options;
  
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true }));
      
      try {
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          signal,
        };

        if (body && method !== 'GET') {
          fetchOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!signal.aborted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!signal.aborted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url, enabled, method, body, headers]);

  return state;
}

export default useFetch; 