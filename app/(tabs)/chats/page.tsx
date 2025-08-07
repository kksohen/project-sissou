import TakeChats from "@/components/community/take-chats";
import { getInitChats } from "../community/actions";
import { Prisma } from "@prisma/client";

export type initChats = Prisma.PromiseReturnType<typeof getInitChats>;

export default async function Chats(){

  const initChats = await getInitChats();

  return(
    <>
    <div 
    style={{
    width: "100dvw",
    marginLeft: "calc(-50vw + 50%)",
    zIndex: 1
    }}
    className="sticky top-0 pt-10
    mode-svg-color-70 backdrop-blur-lg
    shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
      <div className="mx-auto
      max-w-screen-xs sm:max-w-lg 
      md:max-w-screen-sm lg:max-w-screen-md 
      xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <h1 className="font-weight-basic text-2xl form-h2 username-spacing">원 Circles</h1>
      </div>
      <div className="h-[0.0625rem] ring-color opacity-70 mt-3"/>
    </div>
    
    <div className="mt-6 md:mt-8 xl:mt-10 max-w-full mx-auto">
      <TakeChats initChats={initChats}/>
    </div>
    
    </>
  );
}