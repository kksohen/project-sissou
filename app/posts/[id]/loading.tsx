//loading skeleton
export default function Loading(){
  return(
    <div className="my-10 animate-pulse">
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-50 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">

          <div className="w-32 py-2.5 md:py-3.5 loading-color rounded-md"></div>

          <div className="flex gap-2 items-center pt-2">
            <div className="size-8 md:size-10 lg:size-12 rounded-full loading-color"/>

            <div>
              <div className="w-20 py-1 md:py-2 my-2 loading-color rounded-sm"/>
              <div className="w-16 py-1 md:py-2 my-2 loading-bg rounded-sm"/>
            </div>
          </div>

        </div>
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
      </div>
    
      {/* post detail */}
      <div className="pt-32 sm:pt-36 md:pt-40">
        <div className="w-1/2 py-1.5 md:py-2.5 my-2 loading-bg rounded-sm"/>
        <div className="w-1/3 py-1.5 md:py-2.5 loading-bg rounded-sm"/>

        <div className="aspect-[3/4] max-w-[420px] rounded-3xl mt-12 mx-auto loading-color"/>
      </div>
      
      {/* icons */}
      <div className="flex gap-3 items-center mt-6
      *:flex *:items-center *:gap-1 *:size-4 *:rounded-full">
        <span className="loading-bg"></span>
        <span className="loading-bg"></span>
        <span className="ml-auto loading-bg"></span>
      </div>

      <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-4"/>
      
      {/* CommentList */}
      {[...Array(4)].map((_, index)=>(
      <div key={index}>
        <div className="flex gap-2 pt-3">
          <div className="size-8 md:size-10 lg:size-12 rounded-full loading-color">
          </div>
    
          <div>
            <div className="flex items-center gap-1">
              <div className="w-20 py-1 md:py-2 loading-color rounded-sm"/>
              <span className="text-xs md:text-sm lg:text-base opacity-20">|</span>
              <div className="w-16 py-1 md:py-2 loading-bg rounded-sm"/>
            </div>
    
            <div className="w-full py-1 md:py-2 my-1.5 loading-color rounded-sm"/>
          </div>
        </div>

        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-2.5"/>
      </div>
      ))}
    </div>
  );
}