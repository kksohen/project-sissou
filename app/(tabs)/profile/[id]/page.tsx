import ClientUserProfile from "@/components/community/profile/user-profile";
import { notFound, redirect } from "next/navigation";
import { getCachedFollowStatus, getCachedUserInfo, getIsOwner } from "../../community/@modal/(..)profile/[id]/page";
import { Metadata } from "next";
import { getInitUserPosts } from "./actions";
import { Prisma } from "@prisma/client";
import TakeUserPosts from "@/components/community/profile/take-user-posts";

export type initUserPosts = Prisma.PromiseReturnType<typeof getInitUserPosts>;

type Params = Promise<{id: string;}>;

export async function generateMetadata({params}: {params : Params}):Promise<Metadata>{
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };
  const user = await getCachedUserInfo(idNumber);
  if(!user){
    return{
      title: "게시글을 찾을 수 없습니다."
    }
  };

  return{
    title: `${user.username}'s Profile`
  };
};

export default async function UserProfile({params}: {params : Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const user = await getCachedUserInfo(idNumber);
  if(!user) return notFound();

  const isOwner = await getIsOwner(idNumber);
  if(isOwner){
    redirect("/profile");
  };

  const followStatus = await getCachedFollowStatus(idNumber);

  //무한스크롤
  const initUserPosts = await getInitUserPosts(idNumber);

  return(
    <>
    <ClientUserProfile user={user} initFollowStatus={followStatus} isOwner={isOwner}/>
    <TakeUserPosts userId={idNumber} initUserPosts={initUserPosts}/>
    </>
  );
}