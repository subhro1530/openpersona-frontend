import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "OpenPersona — Portfolio Builder",
  description:
    "Build stunning personal and business portfolios in minutes with OpenPersona.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable}`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
