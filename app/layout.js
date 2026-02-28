import { Inter } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "OpenPersona — Portfolio Builder",
  description:
    "Build stunning personal and business portfolios in minutes with OpenPersona.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
