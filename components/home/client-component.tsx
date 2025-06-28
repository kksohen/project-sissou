"use client";

import MenuBar from "../menu-bar";
import HomeIntro from "./home-intro";
import { ModalProvider } from "./modal-context";

export default function ClientComponent(){

  return(
    <ModalProvider>
      <div className="w-full h-full flex flex-col relative">
        {/* three js && condition bar */}
        <HomeIntro />
        {/* bottom bar */}
        <MenuBar />
      </div>
    </ModalProvider>
  );
}