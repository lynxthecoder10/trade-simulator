import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { SimulationBridge } from '@/components/providers/SimulationBridge';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'TradeSim | AI-Powered Trading Simulator',
  description: 'Realistic trading learning ecosystem with AI-assisted decision analysis.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TradeSim',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <SimulationBridge>
          <AppLayout>{children}</AppLayout>
        </SimulationBridge>
      </body>
    </html>
  );
}
