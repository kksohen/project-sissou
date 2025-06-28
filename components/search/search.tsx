import { HomeModalProps } from '../home/home-modal';
import SearchBtn from './search-btn';
import SearchList from './search-list';
import { AnimatePresence } from "framer-motion";

export default function Search({isOpen, onToggle}: HomeModalProps) {

  const closeMenu = ()=>onToggle();

  return(
  <>
    <SearchBtn isOpen={isOpen} setIsOpen={onToggle}/>
    {/* search open */}
    <AnimatePresence>
      {isOpen && <SearchList onClose={closeMenu}/>}
    </AnimatePresence>
  </>
  );
}