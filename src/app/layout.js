import "./globals.css";
import { Share_Tech_Mono } from "next/font/google";

// Use Share Tech Mono font for the cyberpunk aesthetic
const shareTechMono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400", // Only weight 400 exists for Share Tech Mono
  display: "swap",
});

export const metadata = {
  title: "Razvan Bordinc | Portfolio",
  description:
    "Interactive cyberpunk-themed portfolio showcasing software engineering skills and projects",
  keywords: [
    "portfolio",
    "developer",
    "software engineer",
    "dotnet",
    "react",
    "nextjs",
    "fullstack",
  ],
  icons: {
    icon: "/favicon.ico?v=5",
  },
};

export const viewport = {
  themeColor: "#047857",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
      </head>
      <body
        className={`${shareTechMono.className} min-h-screen bg-zinc-950 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
