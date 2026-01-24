import Clock from "@/components/exhibition/born/clock";
import ThreeCanvas1Client from "@/components/exhibition/born/three-canvas1-client";
import ThreeCanvas2Client from "@/components/exhibition/born/three-canvas2-client";
import MenuBar from "@/components/menu-bar";

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
    

    <MenuBar/>
    </>
  );
}