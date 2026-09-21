import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/shell";

export const metadata: Metadata = {
  title: "Local Beef Club — Vidalia",
  description:
    "Know your farmer. Know your food. Scheduled local beef drops from South Georgia ranches, processed in Vidalia, picked up at the processor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
