"use server";

import db from "@/lib/db";

export async function getInitPosts(){
  const posts = await db.post.findMany({
    select:{
      id: true,
      title: true,
      description: true,
      views: true,
      photo: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      _count: {//좋아요, 댓글 갯수 가져오기
        select: {
          comments: true,
          likes: true
        }
      }
    },
    take: 1,
    orderBy:{
      created_at: 'desc'
    }
  });
  return posts;
};

export async function getMorePosts(page: number){
  const posts = await db.post.findMany({
    select:{
      id: true,
      title: true,
      description: true,
      views: true,
      photo: true,
      created_at: true,
      user: {
        select: {
          id: true,
          username: true,
          avatar: true
        }
      },
      _count: {//좋아요, 댓글 갯수 가져오기
        select: {
          comments: true,
          likes: true
        }
      }
    },
    skip: page * 1,
    take: 1,
    orderBy:{
      created_at: 'desc'
    }
  });
  return posts;
};