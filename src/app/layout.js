import { Fraunces, Manrope, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://purebreed.com.bd"),
  title: {
    default: "Purebreed | Honest food, naturally made",
    template: "%s | Purebreed",
  },
  description:
    "Shop traceable spices, cold-pressed oils, pickles and pantry essentials made in Bangladesh. Fast delivery, secure checkout and responsive support.",
  openGraph: {
    title: "Purebreed | Honest food, naturally made",
    description: "Traceable spices, cold-pressed oils and small-batch pantry favourites, delivered across Bangladesh.",
    images: [{ url: "/og.png", width: 1729, height: 910, alt: "Purebreed — Honest food. Naturally made." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Purebreed | Honest food, naturally made",
    description: "Traceable spices, cold-pressed oils and small-batch pantry favourites.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
