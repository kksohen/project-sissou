"use server";

import db from "@/lib/db";
import getSession from "@/lib/session/get-session";
import { revalidatePath, revalidateTag } from "next/cache";
import { commentSchema } from "./schema";

export async function likePost(postId: number){
  const session = await getSession();
  try{
    await db.like.create({
      data: {
        postId,
        userId: session.id!
      }
    });
    revalidateTag(`like-status-${postId}`);
  }catch(error){
    console.error(error);
  };
}

export async function dislikePost(postId: number){
  try{
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!
        }
      }
    });
    revalidateTag(`like-status-${postId}`);
  }catch(error){
    console.error(error);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uploadComment = async(_: any, formData: FormData)=>{
  const data = {
    payload: formData.get("payload"),
    postId: formData.get("postId")
  };

  const result = commentSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    try{
      const session = await getSession();
      const {id, payload, created_at, updated_at,userId,postId} = await db.comment.create({
        data: {
          payload: result.data.payload,
          post: {
            connect:{
              id: Number(result.data.postId)
            }
          },
          user: {
            connect: {
              id: session.id
            }
          },
        }
      });

      revalidateTag("post-detail");

      return {
        fieldErrors: {
          payload: [],
          postId: []
        },
        formErrors: [],
        data: {id, payload, created_at, updated_at, userId, postId}
        };
    }catch(error){
      console.error(error);

      return{
        fieldErrors:{
          payload: ["댓글 작성에 실패했습니다."],
          postId: []
        },
        formErrors: []
      }
    };
  };
}

export async function deleteCommentAction(commentId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId) return false;

  const deleted = await db.comment.delete({
    where: {
      id: commentId,
      userId
    }
  });
  if(!deleted) return false;

  revalidatePath("/community");
  revalidateTag("post-detail");

  return true;
}

export async function deletePostAction(postId: number){
  const session = await getSession();
  const userId = session.id;
  if(!userId) return false;

  const deleted = await db.post.delete({
    where: {
      id: postId,
      userId
    }
  });
  if(!deleted) return false;

  revalidatePath("/community");
  return true;
}