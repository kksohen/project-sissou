"use client";
import { createChatRoom, getFollowingUsers } from "@/app/(tabs)/chats/add/actions";
import { userProfile } from "@/app/(tabs)/chats/add/page";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useActionState, useEffect, useId, useState } from "react";
import { useFormStatus } from "react-dom";

interface ChatFormProps{
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
  // user: userProfile;
};

export default function ChatForm({name, type, placeholder}:ChatFormProps){
  const {pending} = useFormStatus();
  const [followingUsers, setFollowingUsers] = useState<userProfile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [state, action] = useActionState(createChatRoom, null);

  useEffect(()=>{
    const loadFollowing = async()=>{
      try{
        const users = await getFollowingUsers();
        
        //
        const validUsers = users.filter(user => user != null && user.id != null);
        setFollowingUsers(validUsers);
      }catch(error){
        console.error(error);
        setFollowingUsers([]);
      }finally{
        setIsLoading(false);
      }
    };

    loadFollowing();
  }, []);

  const handleSelect = (userId: number)=>{
    if(!useId) return;

    setSelectedUsers(prev => {
      if(prev.includes(userId)){
        return prev.filter(id => id !== userId);

      }else if(prev.length < 3){
        return [...prev, userId];
      };

      return prev;
    });
  };

  return(
    <>
    <div className="pt-20 sm:pt-24">
      <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">

          <h2 className="text-center font-weight-basic username-spacing 
          mb-4 sm:mb-8">초대 인원 선택 ({selectedUsers.length}/3)</h2>

          {isLoading ? (
            <div className="opacity-60 text-center font-weight-basic username-spacing-desc">
              <p>Loading . . .</p>
            </div>
          ) : followingUsers.length === 0 ? (
          <div className="opacity-60 text-center font-weight-basic username-spacing-desc">
            <p>팔로잉 중인 인원이 없습니다.</p>
            <p>새로운 서클을 개설하시겠습니까?</p>
          </div>
          ) : (
          <div className="grid grid-cols-4 gap-4 sm:gap-8">
          {followingUsers.filter(followingUser => followingUser !== null)
          .map(followingUser => (
            <div key={followingUser.id} className="flex justify-center">
              <div data-cursor-target
                onClick={() => handleSelect(followingUser.id)}
                className={`form-text-color fill-[var(--form-text-color)]
                flex flex-col gap-1.5 items-center text-center
                ${selectedUsers.includes(followingUser.id) ? "opacity-100" : "opacity-60"}`}>
                
                <div className="pointer-none size-8 md:size-10 lg:size-12">
                {followingUser?.avatar ? (
                  <Image src={followingUser.avatar}
                    alt={followingUser?.username}
                    className="w-full h-full rounded-full"
                    width={48} height={48} priority quality={100}/>
                  ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="currentColor" className="w-full h-full rounded-full">
                      <path d="M27.233,43.855c1.706-.07,2.609.225,3.782-1.181,2.924-3.502-3.826-12.769-1.522-13.515,2.554-.816,7.326,11.462,10.293,11.068,2.967-.408,10.614-10.055,13.027-8.649,4.195,2.447,9.456,46.296,20.108,17.692,4.043-10.21,3.989,11.63,5.869,1.87,5.869-30.869-14.499-.084-16.325-4.064-.826-1.786,5.956-20.645,7.543-20.279,1.989.45-1.576,9.788.185,10.069.979.153,4.01-6.575,6.962-12.653C70.932,10.05,56.735.15,40.206.15,19.77.15,2.896,15.282.258,34.896c.347-.473.691-.788,1.037-.829,1.696-.197,5.33,9.029,7.254,7.158,1.674-1.631-3.88-17.213.446-12.249,7.434,8.522,14.499-7.777,16.945-5.696,2.272,1.927-12.349,20.562-14.891,22.22-4.666,3.045-5.863-4.289-10.841-.759-.019.013-.039.03-.058.045.697,6.181,2.807,11.934,6,16.938.476-1.482.685-3.414,2.139-5.845,5.163-8.635,13.412-11.785,18.945-12.024ZM39.765,12.466c7.554.563,7.119,18.774.152,19.562-6.88-.478-7.804-19.182-.152-19.562Z"/>
                      <path d="M35.081,75.006c-1.288-2.264-5.812-.338-8.029-3.417-4.043-5.625,7.725-10.787,1.279-21.334-3.011-4.936-9.641-3.839-8.478,13.177.432,6.272.273,9.443-1.023,10.84,4.446,2.773,9.473,4.707,14.86,5.578,1.893-1.786,2.294-3.257,1.391-4.844Z"/>
                      <path d="M42.847,43.855c-8,12.98,16.543,13.191,13.608,23.612-1.261,4.5-7.13,3.924-8.032,6.68-.703,2.153.99,3.265,3.936,4.373,7.648-2.403,14.305-7.015,19.227-13.081-15.672-.528-22.478-31.755-28.739-21.584Z"/>
                  </svg>
                  )}
                </div>

                <h4 className="font-weight-basic username-spacing-comm text-xs md:text-sm lg:text-base pointer-none">{followingUser?.username}</h4>
              </div>
            </div>
          ))}
          </div>
        )}
        </div>
      </div>
    </div>

    {/* input */}
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-10 mode-bg">
      <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
        <div className="max-w-full lg:max-w-4/5 xl:max-w-3/5 mx-auto">

          <form action={action}>
            {/* 팔로잉 목록 비었을 경우 혼자 채팅방 개설ㅇ */}
            {selectedUsers.map(userId => (
            <input key={userId} type="hidden" name="selected" value={userId} />
            ))} 
            
            <div className="mt-3 mb-5">
              <div className="relative mb-1">
                <input type={type} name={name} placeholder={placeholder}
                data-cursor-target
                className="w-full h-10 mx-auto
                focus:outline-none border-none
                ring-[0.0625rem] ring-[var(--ring-color)]
                focus:ring-[var(--form-text-color)]
                form-text-color placeholder:text-[var(--form-text-color)]
                placeholder:opacity-40
                pl-3 font-weight-form rounded-full"/>
                
                <button data-cursor-target
                disabled={pending}
                className="disabled:cursor-not-allowed transition-all absolute right-1 -translate-y-1/2 top-1/2">
                  <PlusCircleIcon className={`pointer-none size-8 ${pending ? "opacity-40" : "opacity-100"}`}/>
                </button>
              </div>
              
              {state?.fieldErrors.title?.map((error, index)=>(
                <span key={index} className="color-warning text-xs md:text-sm font-weight-form pl-3">{error}</span>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}