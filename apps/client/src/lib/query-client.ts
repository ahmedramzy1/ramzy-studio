import { QueryClient } from "@tanstack/react-query";

/**
 * Shared Studio query client.
 *
 * This module is deliberately side-effect free. Runtime/editor code may import
 * the query client without ever importing the browser application bootstrap.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
