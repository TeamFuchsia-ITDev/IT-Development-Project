import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from "@/app/context/AuthContext";
import ToasterContext from "@/app/context/ToasterConster";
import { ModeProvider } from "@/app/context/ModeContext";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serve-Ease",
  description: "Serve-Ease is a user-friendly platform that simplifies the process of requesting various services by connecting users with skilled service providers, making service requests easy and convenient.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        <Provider>
          <ToasterContext />
          <ModeProvider>{children}</ModeProvider>
        </Provider>
      
      </body>
    </html>
  );
}
