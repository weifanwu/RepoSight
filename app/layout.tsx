// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { TreeProvider } from '../context/treeContext';  // Import the TreeProvider

export const metadata = {
  title: 'Folder Upload App',
  description: 'A simple app to upload folders in Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TreeProvider>
          {children} {/* The context is now available to all child components */}
        </TreeProvider>
      </body>
    </html>
  );
}