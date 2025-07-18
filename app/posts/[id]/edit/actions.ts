"use server";

import getSession from "@/lib/session/get-session";
import { postSchema } from "../../add/schema";
import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePost(postId:number, formData: FormData){
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    photo: formData.get("photo"),
  };

  const result = postSchema.safeParse(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      const post = await db.post.update({
        where:{
          id: postId,
        },
        data: {
          title: result.data.title,
          description: result.data.description || null,
          photo: result.data.photo,
          user: {
            connect:{
              id: session.id,
            }
          },
        },
        select:{
          id: true,
        }
      });
      revalidatePath("/community");
      revalidateTag("post-detail");
      redirect(`/posts/${post.id}`);
    }
  }
};