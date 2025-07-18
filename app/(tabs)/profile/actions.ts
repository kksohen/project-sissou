"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { redirect } from "next/navigation";

export async function getUser(id: number){
  const user = await db.user.findUnique({
    where: {
      id
    },
    select: {
      avatar: true,
      username: true,
      email: true,
      // password: true,
      phone: true,
      id: true,
    }
  });

  return user;
}

export async function logOutAction(){
  const session = await getSession();
  session.destroy();
  redirect("/");
};

//사용자가 좋아요를 누른 게시글
export async function getUserLikedPosts(userId: number, page: number){
  const liked = await db.like.findMany({
    where: {
      userId
    },
    select: {
      created_at: true,
      post: {
        select: {
          id: true,
          photo: true
        }
      }
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  return liked.map(like => ({
    id: like.post.id,
    photo: like.post.photo,
    likedAt: like.created_at
  }));
}

//사용자가 댓글을 남긴 게시글
export async function getUserCommentedPosts(userId: number, page: number){
  const commented = await db.comment.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      payload: true,
      created_at: true,
      post: {
        select: {
          id: true,
          title: true,
          photo: true
        }
      }
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  return commented.map(comment => ({
    id: comment.post.id,
    title: comment.post.title,
    photo: comment.post.photo,
    payload: comment.payload,
    commentedAt: comment.created_at
  }));
}