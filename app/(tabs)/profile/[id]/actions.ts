"use server";

import db from "@/lib/db";
import { getImgPlaceholder } from "@/lib/Image/util-img";
import { getThumbnailImage } from "@/lib/utils";

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

  const postWithBlur = await Promise.all(
    userPosts.map(async post=>{
      const thumbnailUrl = `${getThumbnailImage(post.photo)}/public`; 

      return{
        ...post,
        photoBlur: await getImgPlaceholder(thumbnailUrl)
      }
    })
  );

  return postWithBlur;
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

  const postWithBlur = await Promise.all(
    userPosts.map(async post=>{
      const thumbnailUrl = `${getThumbnailImage(post.photo)}/public`; 

      return{
        ...post,
        photoBlur: await getImgPlaceholder(thumbnailUrl)
      }
    })
  );

  return postWithBlur;
}