import Clock from "@/components/exhibition/born/clock";
import ThreeCanvasClient from "@/components/exhibition/born/three-canvas-client";
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
      <ThreeCanvasClient/>

      <Clock/>
    </div>
    

    <MenuBar/>
    </>
  );
}