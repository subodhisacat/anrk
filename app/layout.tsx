import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloatingButton } from "@/components/whatsapp-floating-button";
import { CLINIC } from "@/lib/constants";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: `${CLINIC.name} | Clinic Appointment Booking`,
  description:
    "Book dental appointments online, pay securely with eSewa, and stay updated with timely confirmation messages from the clinic.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <Footer />
          <WhatsAppFloatingButton />
        </div>
      </body>
    </html>
  );
}
