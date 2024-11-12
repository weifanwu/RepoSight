import '../globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Folder Upload App',
  description: 'A simple app to upload folders in Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
