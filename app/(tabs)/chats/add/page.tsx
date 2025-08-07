import HandleBackBtn from "@/components/community/posts/handle-back-btn";
import { getUserProfile } from "../[id]/actions";
import { notFound } from "next/navigation";
import { Prisma } from "@prisma/client";
import ChatForm from "@/components/community/chats/chat-form";

export type userProfile = Prisma.PromiseReturnType<typeof getUserProfile>;

export default async function AddChat(){
  const user = await getUserProfile();
  if(!user) return notFound();

  return(
    <div className="mt-10">
      {/* title */}
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-70 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
          <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">
            <div className="flex items-center">
              <HandleBackBtn />
              
              <h1 className="font-weight-basic text-2xl form-h2 username-spacing">낙원으로 Create Circle</h1>
            </div>
          </div>
        </div>
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-3"/>
      </div>

      <ChatForm name="title" type="text" placeholder="Title . . ." required />
    </div>
  );
}