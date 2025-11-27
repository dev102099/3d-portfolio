import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mysticFont = localFont({
  src: "./fonts/Quicksand-VariableFont_wght.ttf",
  variable: "--font-mystic",
  // weight: "100 900",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dev Parpyani",
  description: "Private Portfolio of Dev Parpyani",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` h-screen w-screen ${mysticFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
