import { Fraunces, Manrope, Hind_Siliguri, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
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
  title: "Purebreed — আপনার সুস্থ ও নিরাপদ জীবনের সঙ্গী",
  description:
    "Purebreed একটি বিশ্বস্ত অনলাইনভিত্তিক খাদ্যপণ্য সরবরাহকারী প্রতিষ্ঠান। ১০০% প্রাকৃতিক ও নিরাপদ খাদ্যপণ্য এখন আপনার দোরগোড়ায়।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${fraunces.variable} ${manrope.variable} ${hindSiliguri.variable} ${jetbrainsMono.variable}`}>
      <body>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
