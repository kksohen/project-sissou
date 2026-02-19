import ConditionBar from "@/components/auth/condition-bar";
import BornClient from "@/components/exhibition/born/born-client";
import MenuBar from "@/components/menu-bar";

export const metadata = {
  title: "Born"
};

export default function Born(){
  return(
    <>
    <BornClient/>

    <MenuBar/>

    <ConditionBar/>
    </>
  );
}