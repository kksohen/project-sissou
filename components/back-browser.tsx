"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BackHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = () => {
      // 페이지 이동 시 edit, add 페이지면 히스토리에서 제거
      const currentPath = window.location.pathname;
      if (currentPath.endsWith("/add") || 
          currentPath.endsWith("/edit") || 
          currentPath.includes("/edit/")) {
        history.replaceState(null, "", currentPath);
      }
    };

    const handlePopState = async () => {
      // 약간의 지연 후 올바른 페이지로 리다이렉트
      setTimeout(async () => {
        try {
          const res = await fetch("/api/back");
          const { path } = await res.json();
          router.replace(path);
        } catch (error) {
          console.error(error);
          router.replace("/");
        }
      }, 0);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router]);

  return null;
}