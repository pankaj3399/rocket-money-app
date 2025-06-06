import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
});

export const metadata = {
  title: "Rocket Money - Smart Money Management",
  description: "Manage your money smarter with Rocket Money. Track expenses, set budgets, and achieve your financial goals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
