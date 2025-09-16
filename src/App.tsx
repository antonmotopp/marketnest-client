import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient.ts';
import { AppRouter } from '@/router';
import { Notifications } from '@/components/ui';
import { Layout } from '@/components/layout';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <AppRouter />
          <Notifications />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
