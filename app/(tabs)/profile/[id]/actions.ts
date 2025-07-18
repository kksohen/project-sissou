"use server";

import db from "@/lib/db";

export async function getInitUserPosts(userId: number){
  const userPosts = await db.post.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      photo: true,
    },
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  return userPosts;
}

export async function getMoreUserPosts(userId: number, page: number){
  const userPosts = await db.post.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      photo: true,
    },
    skip: page * 9,
    take: 9,
    orderBy: {
      created_at: "desc"
    }
  });

  return userPosts;
}