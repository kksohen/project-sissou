"use server";
import { profileSchemaFn } from './schema';
import getSession from "@/lib/session/get-session";
import bcrypt from 'bcrypt';
import db from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(userId: number, formData: FormData){
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
    phone: formData.get("phone"),
    avatar: formData.get("avatar"),
  };

  const profileSchema = profileSchemaFn(userId);
  const result = await profileSchema.spa(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    const session = await getSession();
    if(session.id){
      let hashedPassword;
      if(result.data.password){
        hashedPassword = await bcrypt.hash(result.data.password, 12);
      }

      await db.user.update({
        where: {
          id: userId
        },
        data: {
          username: result.data?.username,
          email: result.data?.email,
          phone: result.data?.phone,
          password: hashedPassword || undefined,
          avatar: result.data?.avatar || undefined
        },
        select: {
          id: true
        }
      });
      revalidatePath("/profile");
      revalidateTag(`user-edit-profile-${userId}`);
      redirect("/profile");
    };
  };
}

export const checkUsernameAvailable = async(username: string, currentUserId?: number)=>{
  const user = await db.user.findUnique({
    where: {
      username
    },
    select: {
      id: true
    }
  });

  if(user && currentUserId && user.id === currentUserId) return false;

  return !!user;
}

export const checkEmailAvailable = async(email: string, currentUserId?: number)=>{
  const user = await db.user.findUnique({
    where:{
      email
    },
    select: {
      id: true
    }
  });

  if(user && currentUserId && user.id === currentUserId) return false;

  return !!user;
}

export const checkPhoneAvailable = async(phone: string, currentUserId?: number)=>{
  const user = await db.user.findUnique({
    where: {
      phone
    },
    select: {
      id: true
    }
  });

  if(user && currentUserId && user.id === currentUserId) return false;

  return !!user;
}