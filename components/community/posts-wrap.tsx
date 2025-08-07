import { getInitPosts } from "@/app/(tabs)/community/actions";
import TakePosts from "./take-posts";
import { Prisma } from "@prisma/client";

export type initPosts = Prisma.PromiseReturnType<typeof getInitPosts>;

export default async function PostsWrap(){
  
  const initPosts = await getInitPosts();

  return(
    <>
    <div 
    style={{
    width: "100dvw",
    marginLeft: "calc(-50vw + 50%)",
    zIndex: 1
    }}
    className="sticky top-0 pt-10 
    mode-svg-color-70 backdrop-blur-lg
    shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
      <div className="mx-auto
      max-w-screen-xs sm:max-w-lg 
      md:max-w-screen-sm lg:max-w-screen-md 
      xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <h1 className="font-weight-basic text-2xl form-h2 username-spacing">편 Pieces</h1>
      </div>
      <div className="h-[0.0625rem] ring-color opacity-70 mt-3"/>
    </div>
    
    <div className="mt-6 md:mt-8 xl:mt-10 max-w-full mx-auto">
      <TakePosts initPosts={initPosts}/>
    </div>
    </>
  );
}