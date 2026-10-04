import type { Metadata, Viewport } from "next";
import "./globals.css";
import HeartBackground from "@/components/HeartBackground";

export const metadata: Metadata = {
  title: "For Swati — My Jannu",
  description: "A little birthday surprise made with love.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeartBackground />
        {children}
      </body>
    </html>
  );
}