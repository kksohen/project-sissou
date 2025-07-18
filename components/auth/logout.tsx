"use client";

import { logOutAction } from "@/app/(tabs)/profile/actions";
import { RectangleStackIcon } from "@heroicons/react/24/solid";

export default function Logout(){

  async function handleLogout(e:React.MouseEvent<HTMLButtonElement>){
    e.preventDefault();

    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if(!confirmed) return;

    await logOutAction();
  };

  return(
    <form> 
      <button onClick={handleLogout} data-cursor-target
      className="rounded-full size-8 sm:size-11 flex justify-center items-center 
      form-text-color form-bg-color
      border-[0.0625rem] border-[var(--ring-color)] 
      hover:bg-error transition-all">
        <RectangleStackIcon className="size-4 sm:size-6 pointer-none stroke-2"/>
      </button>
    </form>
  );
}