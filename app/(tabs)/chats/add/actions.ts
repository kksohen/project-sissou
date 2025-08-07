"use server";

import { POST_MAX_LENGTH_ERROR, POST_MIN_LENGTH_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getFollowingUsers(){
  const session = await getSession();
  if(!session.id) return [];

  const followingUsers = await db.follow.findMany({
    where: {
      followerId: session.id
    },
    include: {
      following: {
        select: {
          id:true,
          username: true,
          avatar: true
        }
      }
    }
  });

  return followingUsers.map(follow => follow.following);
}

const chatSchema = z.object({
  title: z.string({
    required_error: "제목을 기입해주세요."
  }).min(2, POST_MIN_LENGTH_ERROR).max(15, POST_MAX_LENGTH_ERROR),
  selected: z.array(z.number()).max(3, "최대 3명까지 초대할 수 있습니다.").optional()
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createChatRoom(prevState: any, formData: FormData){
  const data = {
    title: formData.get("title"),
    selected: formData.getAll("selected").map(id => parseInt(id as string)),
  };

  const result = chatSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if(session.id){
      if(result.data.selected && result.data.selected.length > 0){ //선택할 수 있는 유저 있을 경우
        //팔로잉 중 인지 확인
        const isFollowing = await db.follow.findMany({
          where: {
            followerId: session.id,
            followingId: {
              in: result.data.selected
            }
          }
        });
        if(isFollowing.length !== result.data.selected.length){
          return{
            fieldErrors: {},
            formErrors: ["팔로잉 중인 상대만 초대할 수 있습니다."]
          }
        };
      }
      
      const chatRoom = await db.chatRoom.create({
        data: {
          name: result.data.title,
          type: "GROUP",
          max_participants: Math.max(4, (result.data.selected?.length || 0) + 1),
          chatRoomUsers: {
            create: [
              {
                userId: session.id,
                role: "HOST"
              },
              ...(result.data.selected?.map(userId => ({
                userId,
                role: "MEMBER"
              })) || [])
            ]
          }
        },
        select: {
          id: true
        }
      });

      revalidatePath("/community");
      redirect(`/chats/${chatRoom.id}`);
    }
  };
}