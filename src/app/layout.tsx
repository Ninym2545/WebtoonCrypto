"use client"
import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { ChakraProvider } from "@chakra-ui/react";
import WithSubnavigation from "@/components/Navbar/Navbar";
import AuthProvider from "@/components/AuthProvider/AuthProvider";
import { useEffect, useState } from "react";
import Loading from "./loading";
import Sidebar from "../components/Sidebar/Sidebar";
const inter = Noto_Sans_Thai({ subsets: ["latin"], weight: ["500"] });



interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState(false);
  const [shownav, setShownav] = useState(false);

  useEffect(() => {
    if (window.location.href.includes('creator') || window.location.href.includes('admin')) {
      setNav(true);
    }
    if (window.location.href.includes('contents/') || window.location.href.includes('viewer/')) {
      setShownav(true);
    }
    // Simulate a delay to demonstrate the loading page
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the duration as needed

    // Clear the timeout if the component is unmounted before the timeout completes
    return () => clearTimeout(timeout);
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <AuthProvider>
            {loading ? (
              <Loading />
            ) : (
              <>
                {shownav ? null : nav ? <Sidebar children={children} /> : <WithSubnavigation />}
                {nav ? null : children}
              </>
            )}
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}