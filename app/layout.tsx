import type { Metadata } from "next";
import Script from "next/script";
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
}>){

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

        {/* adobe fonts */}
        <Script id="adobe-fonts" strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d) {
              var config = {
                kitId: 'mad4vgo',
                scriptTimeout: 3000,
                async: true
              },
              h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
            })(document);
          `,
        }}/>
      </body>
    </html>
  );
}