import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rocket Money - Smart Money Management",
  description: "Take control of your finances with Rocket Money's smart money management tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Toaster />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
