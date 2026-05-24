import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

import { SubscriptionProvider } from './context/SubscriptionContext';

export const metadata: Metadata = {
  title: "Signalist",
  description: "Signalist trading dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b',
              color: '#fff',
              border: '1px solid #3f3f46',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
