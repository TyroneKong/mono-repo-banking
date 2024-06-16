'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserContextProvider } from './app/contexts/user';

function Providers({ children }: { children: React.ReactNode }) {
  const queryclient = new QueryClient();

  return (
    <QueryClientProvider client={queryclient}>
      <UserContextProvider>{children}</UserContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default Providers;
