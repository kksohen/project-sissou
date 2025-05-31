"use client";

import SearchBtn from './search-btn';
import SearchList from './search-list';
import { AnimatePresence } from "framer-motion";

interface SearchProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Search({isOpen,setIsOpen,setMenuOpen}:SearchProps) {

  return(
  <>
    <SearchBtn isOpen={isOpen} setIsOpen={(value)=>{
      setMenuOpen(false);
      setIsOpen(typeof value === "function" ? value : ()=> value);
    }}/>
    {/* search open */}
    <AnimatePresence>
      {isOpen && <SearchList />}
    </AnimatePresence>
  </>
  );
}