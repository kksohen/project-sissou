import ConditionBar from "@/components/home/condition-bar";
import ThreeCanvas from "@/components/home/three-canvas";
import MenuBar from "@/components/menu-bar";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* three js*/}
      <ThreeCanvas />
      {/* condition bar */}
      <ConditionBar />
      {/* bottom bar */}
      <MenuBar />
    </div>
  );
}