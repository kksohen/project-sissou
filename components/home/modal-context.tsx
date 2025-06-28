"use client";
import { createContext, useCallback, useState } from "react";
//menu, search, homeModal끼리는 공유 <-> ThreeHomeBtn은 따로 관리하기 위함
interface ModalState{
  menu: boolean;
  search: boolean;
  homeModal: boolean;
};

interface ModalContextType{
  isOpen: ModalState;
  onToggle: (state: "menu" | "search" | "homeModal") => void;
};

export const ModalContext = createContext<ModalContextType>({
  isOpen: { menu: false, search: false, homeModal: false },
  onToggle: () => {}
});

export function ModalProvider({children}:{children: React.ReactNode}){
  const [isOpen, setIsOpen] = useState<ModalState>({
    menu: false,
    search: false,
    homeModal: false,
  });

  const onToggle = useCallback((state: "menu" | "search" | "homeModal")=>{
    setIsOpen(prev=>{
      if(prev[state]){ //모달창 이미 열린 상태이면 닫기
        return{
          ...prev,
          [state]: false
        };
      };

      const newState={...prev}; //해당 모달창 열기(다른 건 닫힌 상태로)
      Object.keys(newState).forEach(key=>{
        if(key !== state){
          newState[key as keyof typeof newState] = false;
        };
      });
      newState[state] = true;
      return newState;
    });
  }, []);

  return(
    <ModalContext.Provider value={{isOpen, onToggle}}>
      {children}
    </ModalContext.Provider>
  );
};