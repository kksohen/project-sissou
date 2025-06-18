import HomeInteractive from "@/components/home/home-interactive";
import MenuBar from "@/components/menu-bar";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* three js && condition bar */}
      <HomeInteractive />
      {/* bottom bar */}
      <MenuBar />
    </div>
  );
}