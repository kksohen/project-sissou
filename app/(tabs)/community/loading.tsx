//loading skeleton
export default function Loading(){
  return(
    <div className="my-10 max-w-full mx-auto animate-pulse">
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-50 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm
        lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
          <div className="w-32 py-3.5 loading-bg rounded-lg"/>
        </div>
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
      </div>

      <div className="pt-16 items-start grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
      {[...Array(6)].map((_, index)=>(
      <div key={index}>
        {/* logo modal */}
        <div className="flex flex-col items-center">
          <div className="size-16 rounded-full loading-bg"></div>
          <div className="w-20 py-2 loading-bg my-2 rounded-md"></div>
        </div>
      
        {/* post */}
        <div className="pt-3 px-10 trapezoid-posts loading-bg">
          <div className="flex flex-col items-center">
            <div className="w-28 py-3.5 loading-color rounded-lg"></div>
            <div className="w-20 py-2 my-2 loading-color rounded-md"></div>
            <div className="w-16 py-1.5 loading-color rounded-md"></div>
          </div>

          <div className="flex gap-4 items-center py-3
          *:flex *:items-center *:gap-1 *:size-4 *:rounded-full">
            <span className="loading-color"></span>
            <span className="loading-color"></span>
            <span className="ml-auto loading-color"></span>
          </div>
        </div>

        <div className="rounded-t-none rounded-b-3xl w-full h-auto aspect-video mx-auto loading-color"></div>
      </div>
      ))}
    </div>
  </div>
  )
}