import ConditionBar from "@/components/home/condition-bar";
import MenuBar from "@/components/menu-bar";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* three js*/}
      <div>
        <div>three js img assets</div>
        <div>한글입니다.</div>
      </div>
      {/* condition bar */}
      <ConditionBar />
      {/* bottom bar */}
      <MenuBar />
    </div>
  );
}