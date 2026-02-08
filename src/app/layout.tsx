import type { Metadata } from 'next';
import './globals.css';
import Layout from '@components/core/Layout';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ThemeProvider from '@providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'PFN Fixture Design Admin Tool',
  description: 'PFN Fixture Design Admin Tool UI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <ThemeProvider>
            <Layout>{children}</Layout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
