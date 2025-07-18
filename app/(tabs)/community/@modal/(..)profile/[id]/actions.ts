"use server";
import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidateTag } from "next/cache";

export async function getUserInfo(id: number){
  const userInfo = await db.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
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

export async function followUser(userId: number){
  const session = await getSession();
  try{
    await db.follow.create({
      data: {
        followerId: session.id!,
        followingId: userId
      }
    });
    revalidateTag(`follow-status-${userId}`);
    revalidateTag(`user-profile-${userId}`);
  }catch(error){
    console.error(error);
  };
}

export async function unfollowUser(userId: number){
  const session = await getSession();
  try{
    await db.follow.delete({
      where: {
        id: {
          followerId: session.id!,
          followingId: userId
        }
      }
    });
    revalidateTag(`follow-status-${userId}`);
    revalidateTag(`user-profile-${userId}`);
  }catch(error){
    console.error(error);
  };
}

export async function getFollowStatus(userId: number, currentUserId: number){
  try{
    const isFollowing = await db.follow.findUnique({
      where: {
        id: {
          followerId: currentUserId,
          followingId: userId
        }
      }
    });

    const followerCount = await db.follow.count({
        where: {
          followingId: userId
        }
      });

    return{
      isFollowing: Boolean(isFollowing),
      followerCount,
    };
  }catch(error){
    console.error(error);
    return{
      isFollowing: false,
      followerCount: 0,
    };
  };
}