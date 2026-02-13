import Clock from "@/components/exhibition/born/clock";
import GradAlbum from "@/components/exhibition/born/graduation-album";
import ThreeCanvas1Client from "@/components/exhibition/born/three-canvas1-client";
import ThreeCanvas2Client from "@/components/exhibition/born/three-canvas2-client";
import ThreeCanvas3Client from "@/components/exhibition/born/three-canvas3-client";
import MenuBar from "@/components/menu-bar";
import BornBg from "@/public/assets/images/born-bg";

export const metadata = {
  title: "Born"
};

export default function Born(){
  return(
    <>
    <div className="mt-10">
      <h1 className="font-agahnsangsoo text-4xl sm:text-5xl text-center">어느 날, 그들은 태어났다...</h1>
    </div>
    
    <div className="grid grid-cols-3 items-center">
      <ThreeCanvas1Client/>

      <Clock/>

      <ThreeCanvas2Client/>
    </div>

    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="relative">
        <BornBg/>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full">
            <ThreeCanvas3Client/>
          </div>
        </div>
      </div>
    </div>

    <div>
      <GradAlbum/>
    </div>
    

    <MenuBar/>
    </>
  );
}