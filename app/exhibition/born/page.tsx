import ThreeCanvasWrap from "@/components/exhibition/born/three-canvas-wrap";
import MenuBar from "@/components/menu-bar";

export const metadata = {
  title: "Born"
};

export default function Born(){
  return(
    <>
    <div className="font-agahnsangsoo text-5xl">어느 날, 그들은 태어났다...</div>
    
    <ThreeCanvasWrap/>

    <MenuBar/>
    </>
  );
}