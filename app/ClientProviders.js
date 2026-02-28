"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}
