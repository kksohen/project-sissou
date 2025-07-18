import MenuBar from "@/components/menu-bar";
import { getUser } from "./actions";
import { getInitUserPosts } from "./[id]/actions";
import { unstable_cache as nextCache } from 'next/cache';
import getSession from "@/lib/session/get-session";
import { notFound } from "next/navigation";
import { getCachedUserInfo } from "../community/@modal/(..)profile/[id]/page";
import ProfileWrap from "@/components/profile/profile-wrap";

export const metadata = {
  title: 'Profile',
};

async function getCachedUserEdit(id: number){
  const cachedOperation = nextCache(getUser, ["user-edit-profile"], {
    tags: [`user-edit-profile-${id}`],
    revalidate: 60
  });
  return cachedOperation(id);
};

export default async function Profile(){
  const session = await getSession();
  if(!session.id) return notFound();

  const [profileInfo, editInfo, initUserPosts] = await Promise.all([
    getCachedUserInfo(session.id), //기존 프로필 상단 부분
    getCachedUserEdit(session.id), //사용자 개인정보 수정 부분
    getInitUserPosts(session.id) //무한스크롤 부분
  ]);

  if(!profileInfo || !editInfo) return notFound();

  return(
    <>
      <ProfileWrap profileInfo={profileInfo}
      initUserPosts={initUserPosts}
      userId={session.id} />
      {/* <ConditionBar /> */}
      <MenuBar/>
    </>
  );
}