"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

export const MouseCursor = ()=>{
  const pathname = usePathname();
  const [pos, setPos]  = useState({x: 0, y: 0});
  const [active, setActive] = useState(false); //cursor hover, focus, click, active
  const [color, setColor] = useState("#FF5FCF");

  useEffect(()=>{
    let colorVar = "--color-accent";

    if(pathname === "/exhibition/born" || pathname === "/exhibition/growth"){
      colorVar = "--color-secondary";
    }else if(pathname === "/exhibition/end" || pathname === "/brand"){
      colorVar = "--color-primary";
    };

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
    if(accentColor){
      setColor(accentColor);
    };

    const move = (e:MouseEvent)=>{
      setPos({x: e.clientX, y: e.clientY});
    };
    const down = ()=> setActive(true);
    const up = ()=> setActive(false);

    const isCursorTarget = (el: HTMLElement | null): boolean => {
      return !!el?.closest("[data-cursor-target]");
    };

    const onMouseOver = (e:MouseEvent)=>{
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if(
        isCursorTarget(target) && (!related || !target.contains(related))
      ){
        setActive(true);
      }
    };
    const onMouseOut = (e:MouseEvent)=>{
      const target = e.target as HTMLElement;
      const related = e.relatedTarget as HTMLElement | null;
      if(
        isCursorTarget(target) && (!related || !target.contains(related))
      ){
        setActive(false);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return()=>{
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };

  }, [pathname]);

  const rad = active ? 24 : 12;
  const cursorSize = 48;
  const center = cursorSize / 2;

  return (
    <svg width={cursorSize} height={cursorSize}
    viewBox={`0 0 ${cursorSize} ${cursorSize}`} xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "fixed",
      top: pos.y - center,
      left: pos.x - center,
      pointerEvents: "none",
      zIndex: 99,
    }}>
      <circle
        opacity="0.5"
        cx={center}
        cy={center}
        r={rad}
        fill={color}
        style={{transition: "r 0.3s ease"}}
      />
      <circle cx={center} cy={center} r={5} fill={color} />
    </svg>
  );
}