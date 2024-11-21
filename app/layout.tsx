// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { FileTreeProvider } from '../context/treeContext';  // Import the TreeProvider

export const metadata = {
  title: 'Folder Upload App',
  description: 'A simple app to upload folders in Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FileTreeProvider>
          {children} {/* The context is now available to all child components */}
        </FileTreeProvider>
      </body>
    </html>
  );
}