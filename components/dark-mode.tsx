"use client";

import { useEffect } from "react";

export default function DarkMode() {
  //dark mode - 기본적으로 system setting에 따른 적용 후 user가 btn을 통해 변환 시 그걸 우선해서 유지할 수 있도록ㅇ
  useEffect(()=>{
    const root = document.documentElement;
    const isDark = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (mode: "dark" | "light")=>{
      root.classList.toggle("dark", mode === "dark");
    };
    //localStorage 설정 확인
    const saved = localStorage.getItem("theme");
    if(saved === "dark" || saved === "light"){
      applyTheme(saved);
    }else{
      applyTheme(isDark.matches ? "dark" : "light");
    }

    //시스템에 따른 초기의 다크모드 적용
    const handleChange = (e:MediaQueryListEvent)=>{
      const saved = localStorage.getItem("theme");
      if(!saved){
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    isDark.addEventListener("change", handleChange);

    return()=> isDark.removeEventListener("change", handleChange);
  }, []);

  return null; 
}