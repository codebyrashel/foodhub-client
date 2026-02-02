import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FoodHub | Discover & Order Meals",
  description: "Browse meals, order easily (COD), and track delivery status.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="bg-foodhub">
          <div className="mx-auto min-h-[calc(100vh-64px)] max-w-6xl px-4 py-8">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}