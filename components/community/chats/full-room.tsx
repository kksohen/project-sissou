"use client";
import { useEffect, useRef } from "react";

export default function FullRoom(){
  const showAlert = useRef(false);

  useEffect(()=>{
    if(showAlert.current) return;

    showAlert.current = true;

    alert("서클 인원이 가득 찼습니다.");
    window.location.href = "/community";
  }, []);

  return null;
}