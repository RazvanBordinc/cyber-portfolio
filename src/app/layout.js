import "./globals.css";
import { Share_Tech_Mono } from "next/font/google";

// Use Share Tech Mono font for the cyberpunk aesthetic
const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400", // Only weight 400 exists for Share Tech Mono
  display: "swap",
});

export const metadata = {
  title: "Razvan Bordinc | Cyber Portfolio",
  description:
    "Interactive cyberpunk-themed portfolio showcasing software engineering skills and projects",
  keywords: [
    "portfolio",
    "developer",
    "software engineer",
    "cyberpunk",
    "react",
    "nextjs",
  ],
};

// Next.js 15 requires themeColor to be in viewport export
export const viewport = {
  themeColor: "#047857", // Emerald-700 color
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <head>
        {/* Favicon and other meta tags can be added here */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${shareTechMono.className} min-h-screen bg-zinc-950 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
