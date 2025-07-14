"use client";

import MenuBar from "../menu-bar";
import HomeIntro from "./home-intro";

export default function ClientComponent(){

  return(
    <div className="w-full h-full flex flex-col relative">
      {/* three js && condition bar */}
      <HomeIntro />
      {/* bottom bar */}
      <MenuBar />
    </div>
  );
}