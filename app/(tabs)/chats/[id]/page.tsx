import { Metadata } from "next";
import { getMessages, getRoomJoin, getUserProfile } from "./actions";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import getSession from "@/lib/session/get-session";
import HandleBackBtn from "@/components/community/posts/handle-back-btn";
import Link from "next/link";
import Image from "next/image";
import ChatMessageList from "@/components/community/chats/chat-message-list";
import FullRoom from "@/components/community/chats/full-room";
import VideoCallWrap from "@/components/community/chats/videocall-wrap";

type Params = Promise<{id: string;}>;
export type InitChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

export async function generateMetadata({params}: {params : Params}):Promise<Metadata>{
  const {id} = await params;
  
  const room = await getRoomJoin(id);
  if(!room){
    return{
      title: "서클을 찾을 수 없습니다."
    }
  };

  return{
    title: room.name || "Circle"
  };
};

export default async function ChatRoom({params}: {params : Params}){
  const {id} = await params;
  const room = await getRoomJoin(id);
  if(!room) return notFound();

  //채팅방 다 찼을 때
  if("isFull" in room && room.isFull){
    return (
      <FullRoom/>
    );
  }

  const session = await getSession();
  const initMessages = await getMessages(id, session.id!);
  const user = await getUserProfile(); //username, avatar
  if(!user) return notFound();

  const isGroupChat = room.type === "GROUP";
  const participants = room.chatRoomUsers.map(p => p.user);
  const participantCount = room.chatRoomUsers.length;

  //group chat
  const host = isGroupChat ? room.chatRoomUsers.find(p => p.role === "HOST")?.user : null;

  const otherUsers = isGroupChat ? participants.filter(p => p.id !== session.id) : [];

  //1:1 chat
  const otherUser = !isGroupChat ? participants.find(p => p.id !== session.id) : null;

  const roomData={
    title: room.name || "Circle",
    isGroupChat,
    host,
    otherUsers,
    otherUser
  };

  return(
    <div>
      <div className="fixed top-0 left-0 right-0 pt-10 z-10
      mode-svg-color-70 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
          <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto flex items-center justify-between">
            <HandleBackBtn />

            {roomData.isGroupChat ? ( 
            /* 그룹 채팅 */
            <div className="flex flex-col gap-1.5 items-center justify-center">

              <div className="flex relative">
              
                <div className="size-8 md:size-10 lg:size-12 pointer-none">
                {roomData.host?.avatar ? (
                  <Image className="rounded-full"
                  src={roomData.host?.avatar} alt={roomData.host?.username} width={48} height={48} priority quality={100}/>
                  ):(
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
                    <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
                  <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
                  <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
                  </svg>
                )}
                </div>

                {roomData.otherUsers.length > 1 && (
                <div className="absolute -right-3.5 md:-right-4 lg:-right-5 text-[0.625rem] md:text-xs lg:text-sm font-weight-form color-primary">
                  +{roomData.otherUsers.length}
                </div>
                )}
              </div>

              <h4 className="font-weight-basic username-spacing-comm text-xs md:text-sm lg:text-base pointer-none">{roomData.title}</h4>
            </div>
            ) : roomData.otherUser ? (
            /* 1:1 채팅 */
            <Link href={`/profile/${roomData.otherUser.id}`} data-cursor-target
            className="flex flex-col gap-1.5 items-center justify-center">
              <div className="size-8 md:size-10 lg:size-12 pointer-none">
              {roomData.otherUser.avatar ? (
                <Image className="rounded-full"
                src={roomData.otherUser.avatar} alt={roomData.otherUser.username} width={48} height={48} priority quality={100}/>
                ):(
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor">
                <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
                <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
                <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
                </svg>
              )}
              </div>
              <h4 className="font-weight-basic username-spacing-comm text-xs md:text-sm lg:text-base pointer-none">{roomData.otherUser.username}</h4>
            </Link>
            ) : null}
            
            {/* videoCall */}
            <VideoCallWrap
            chatRoomId={id}
            userId={user.id}
            username={user.username} avatar={user.avatar}
            participants={participants.map(p=>({
              id: p.id, username: p.username 
            }))}
            />
          </div>
        </div>

        <div className="h-[0.0625rem] w-full ring-color opacity-70 mt-2.5"/>
      </div>
      
      <ChatMessageList initMessages={initMessages} userId={session.id!} chatRoomId={id} username={user.username} avatar={user.avatar} isGroupChat={roomData.isGroupChat} participantCount={participantCount}/>
    </div>
  );
}