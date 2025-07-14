"use server";

import { EMAIL_ERROR, PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import updateSession from "@/lib/session/update-session";

const checkUserExists = async(email: string)=>{
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id: true
    }
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z.string().email(EMAIL_ERROR).toLowerCase().refine(checkUserExists, "존재하지 않는 이메일입니다."),
    password: z.string({
      required_error: "비밀번호를 입력해주세요.",
    }).min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const login = async(prevState: any, formData: FormData)=>{
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  }
  const result = await formSchema.spa(data);
  if(!result.success){
    return result.error.flatten();
  }else{
    /* 
    1. 이메일로 유저 찾기
    2. 1번 찾을 시, 비밀번호 해시값 체크
    3. 로그인, redirect("/profile")
    */
    const user = await db.user.findUnique({
      where:{
        email: result.data.email
      },
      select:{
        id: true,
        password: true,
      }
    });
    const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
    if(ok){
      await updateSession(user!.id);
      redirect("/profile");
    }else{
      return{
        fieldErrors:{
          password: ["틀린 비밀번호입니다."],
          email: [],
        }
      }
    }
  }
};