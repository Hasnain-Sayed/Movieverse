import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/hero/Header.jsx";
import Footer from "@/components/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MovieVerse",
  description: "A Movie and TV Series Discovery App",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scrollbar-thin scrollbar-thumb-amber-400 scrollbar-gutter-stable`}
    >
      <body className="min-h-full flex flex-col">
        
         <Header/>
        {children}
        <Footer />


      </body>
    </html>
  );
}
