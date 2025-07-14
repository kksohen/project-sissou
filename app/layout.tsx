import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import DarkMode from "@/components/dark-mode";
import { MouseCursor } from "@/components/mouse-cursor";
import { ModalProvider } from '../components/modal-context';

//local font
const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: {
    template: "%s | SISSOU",
    default: "SISSOU",
  },
  description: "SISSOU is SOU's 2025 Online Exhibition Project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} mx-auto 
        max-w-screen-xs 
        media-text-xs
        sm:max-w-lg 
        sm:text-sm
        md:max-w-screen-sm 
        md:text-base
        lg:max-w-screen-md 
        lg:text-lg
        xl:max-w-screen-lg 
        xl:text-xl
        2xl:max-w-screen-xl
        scrollbar-hidden
        `}
      >
        <DarkMode />
        <MouseCursor />
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}