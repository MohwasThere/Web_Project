import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signalist",
  description: "Signalist trading dashboard",
};

import { SubscriptionProvider } from './context/SubscriptionContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </body>
    </html>
  );
}
