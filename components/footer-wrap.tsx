"use client";
import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function FooterWrap(){
  const pathname = usePathname();

  //footer 노출되는 페이지 : 전시, 포폴, 커뮤, 컨택
  const hideFooter = ["/", "/login", "/sms", "/create-account"];
  const hideStartsWith = ["/posts", "/chats", "/profile"];
  const hideSub = pathname?.startsWith("/portfolio/");

  if(!pathname || hideFooter.includes(pathname) || hideStartsWith.some((path) => pathname.startsWith(path)) || hideSub){
    return null;
  }

  return(
    <Footer/>
  );
}