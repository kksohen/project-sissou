import ClientProfileModal from "@/components/community/profile/profile-modal";
import db from "@/lib/db";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

type Params = Promise<{id: string;}>;

export type userProfile = NonNullable<Prisma.PromiseReturnType<typeof getUserInfo>>;

async function getUserInfo(id: number){
  const userInfo = await db.user.findUnique({
    where: {
      id
    },
    select: {
      username: true,
      avatar: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true
        }
      },
      posts: {
        take: 3,
        orderBy: {
          created_at: "desc"
        },
        select: {
          id: true,
          photo: true
        }
      }
    },
  });
  return userInfo;
}

export default async function ProfileModal({params}: {params : Params}){
  const {id} = await params;
  const idNumber = Number(id);
  if(isNaN(idNumber)){
    return notFound();
  };

  const user = await getUserInfo(idNumber);
  if(!user) return notFound();

  return(
    <ClientProfileModal user={user}/>
  );
}