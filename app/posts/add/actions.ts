"use server";

import getSession from "@/lib/session/get-session";
import { postSchema } from "./schema";
import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function uploadPost(formData:FormData) {
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
      const post = await db.post.create({
        data: {
          title: result.data.title,
          photo: result.data.photo,
          description: result.data.description || null,
          user: {
            connect: {
              id: session.id
            }
          }
        },
        select:{
          id: true
        }
      });
      revalidatePath("/community");
      revalidateTag("post-detail");
      redirect(`/posts/${post.id}`);
    };
  };
}

export async function getUploadUrl(){
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v2/direct_upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_TOKEN}`
    }
  });
  const data = await res.json();
  return data;
}