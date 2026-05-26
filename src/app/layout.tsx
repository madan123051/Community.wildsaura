import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WildSaura Community',
  description: 'Connect with wildlife lovers across WildSaura, Drishya, and Market',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
