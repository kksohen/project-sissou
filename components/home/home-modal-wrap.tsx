"use client";
import { useContext } from "react";
import HomeModal from "./home-modal";
import { ModalContext } from "./modal-context";

export default function HomeModalWrap(){
const {isOpen, onToggle} = useContext(ModalContext);

  return(
    <HomeModal isOpen={isOpen.homeModal} onToggle={()=>onToggle("homeModal")}/>
  );
};