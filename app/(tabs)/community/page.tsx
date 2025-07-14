import TakePosts from "@/components/community/take-posts";
import MenuBar from "@/components/menu-bar";
import { Prisma } from "@prisma/client";
import { getInitPosts } from "./actions";
import ConditionBar from "@/components/community/condition-bar";

export const metadata = {
  title: 'Community',
};

export type initPosts = Prisma.PromiseReturnType<typeof getInitPosts>;

export default async function Community(){
  //loading page building
  // await new Promise(resolve => setTimeout(resolve, 50000));

  const initPosts = await getInitPosts();

  return(
    <>
    <div className="fixed top-0 left-0 right-0 z-10 pt-10
    mode-svg-color-50 backdrop-blur-lg 
    shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
      <div className="mx-auto
      max-w-screen-xs 
      sm:max-w-lg 
      md:max-w-screen-sm 
      lg:max-w-screen-md 
      xl:max-w-screen-lg 
      2xl:max-w-screen-xl">
        <h1 className="font-weight-basic text-2xl form-h2 username-spacing">편 Pieces</h1>
      </div>
      <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
    </div>
    
    <div className="my-10 max-w-full mx-auto">
      <TakePosts initPosts={initPosts}/>

      <ConditionBar />
      <MenuBar />
    </div>
  </>
  );
}

/* Skipping auto-scroll behavior due to `position: sticky` or `position: fixed` on element: */