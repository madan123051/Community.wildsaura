import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WildSaura Community 🌿',
  description: 'Share your wildlife & nature photography with the WildSaura community.',
  openGraph: {
    title: 'WildSaura Community 🌿',
    description: 'Join wildlife & nature photography lovers worldwide.',
    url: 'https://community.wildsaura.com',
    siteName: 'WildSaura Community',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-wa-bg text-wa-text antialiased">
        {children}
      </body>
    </html>
  );
}
