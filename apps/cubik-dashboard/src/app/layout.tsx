import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";
import { Header } from "@/components/Headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CUBIK",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html className="dark" lang="en">
      <body className={`bg-white dark:bg-[#141414] ${inter.className}`}>
        <Provider>
          <>
            <Header />
            {children}
          </>
        </Provider>
      </body>
    </html>
  );
}
