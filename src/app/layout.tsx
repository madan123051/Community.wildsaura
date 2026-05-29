import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WildSaura Community',
  description: 'Connect with wildlife and nature photography lovers across WildSaura, Drishya, and Market. Share posts, join discussions, and explore the wild.',
  keywords: ['wildlife', 'nature', 'photography', 'community', 'wildsaura', 'nepal', 'drishya'],
  openGraph: {
    title: 'WildSaura Community 🌿',
    description: 'Connect with wildlife lovers across WildSaura, Drishya, and Market',
    url: 'https://community.wildsaura.com',
    siteName: 'WildSaura Community',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
