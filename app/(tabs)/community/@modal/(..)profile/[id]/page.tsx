import ClientProfileModal from "@/components/community/profile/profile-modal";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import { getFollowStatus, getUserInfo } from "./actions";
import { unstable_cache as nextCache } from 'next/cache';
import getSession from "@/lib/session/get-session";
import { getImgPlaceholder } from "@/lib/Image/util-img";
import { getThumbnailImage } from "@/lib/utils";

type Params = Promise<{id: string;}>;

export type userProfile = NonNullable<Prisma.PromiseReturnType<typeof getUserInfo>>;

export type followStatus = NonNullable<Prisma.PromiseReturnType<typeof getFollowStatus>>;

export async function getCachedUserInfo(id: number){
  const cachedOperation = nextCache(getUserInfo, ["user-profile"], {
  tags: [`user-profile-${id}`],
  revalidate: 60
});
return cachedOperation(id);
};

export async function getCachedFollowStatus(userId: number){
  const session = await getSession();
  const currentUserId = session.id;
  const cachedOperation = nextCache(getFollowStatus, ["follow-status"], {
    tags: [`follow-status-${userId}`],
  });
  return cachedOperation(userId, currentUserId!);
};

export async function getIsOwner(userId: number){
  const session = await getSession();
  if(session.id){
    return session.id === userId;
  };
  return false;
};

export default async function ProfileModal({params}: {params : Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const user = await getCachedUserInfo(idNumber);
  if(!user) return notFound();

  const isOwner = await getIsOwner(idNumber);

  //follow
  const followStatus = await getCachedFollowStatus(idNumber);

  //Image 최적화
  const photoBlur = await Promise.all(
    user.posts.map(async (post)=>{
    const thumbnail = getThumbnailImage(post.photo);
    return getImgPlaceholder(`${thumbnail}/public`);
    })
  );

  return(
    <ClientProfileModal user={user} initFollowStatus={followStatus} isOwner={isOwner}
    photoBlur={photoBlur}/>
  );
}