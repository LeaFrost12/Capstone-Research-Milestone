import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Credit Card Wallet Manager",
  description: "A simple local credit card wallet preview.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body className="min-h-full flex flex-col"><ClerkProvider signInFallbackRedirectUrl="/wallet" signUpFallbackRedirectUrl="/wallet">{children}</ClerkProvider></body>
    </html>
  );
}
