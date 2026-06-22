import type { Metadata } from 'next';
import './globals.css';
import './premium.css';

export const metadata: Metadata = {
  title: 'MBK Transit',
  description: 'Système de gestion de transit pour MBK Business International',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
