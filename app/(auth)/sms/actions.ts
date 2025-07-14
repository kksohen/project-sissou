"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import validator from 'validator';
import updateSession from "@/lib/session/update-session";
import twilio from "twilio";

async function getToken(){
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {token},
    select: {id: true}
  });
  if(exists){
    return getToken();
  }else{
    return token;
  };
};

async function tokenExists(token: number){
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString()
    },
    select: {id: true}
  });
  return Boolean(exists);
};

const phoneSchema = z.string().trim().refine(
  (phone)=> validator.isMobilePhone(phone, "ko-KR"), "올바른 전화번호 형식이 아닙니다."
);
const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, "잘못된 인증번호입니다.");
//coerce: string -> number로 변환ㅇ

interface ActionState{
  token: boolean;
  phone?: string;
};

export async function smsLogin(prevState: ActionState, formData: FormData){

  const phone = formData.get("phone");
  const token = formData.get("token"); 

  if(!prevState.token){ //token이 없으면(첫 인증 시)
    const result = phoneSchema.safeParse(phone);
    if(!result.success){//인증 실패
      return { 
        token: false,
        error: result.error.flatten()
      };
    }else{//인증 성공 시 
    //1.다른 토큰 요청 시 이전 토큰 삭제해야ㅇ
    //2.새 토큰 발급
    //3.twilio를 활용한 문자 발송 
    await db.sMSToken.deleteMany({
      where:{
        user: {
          phone: result.data
        }
      }
    });

    const token = await getToken();

    await db.sMSToken.create({
      data: {
        token,
        user:{
          connectOrCreate: { //번호가 있을 시에는 기존 user를 연결하고, 그렇지 않을 시 새로운 user 생성
            where: {phone: result.data},
            create: {
              username: crypto.randomBytes(10).toString("hex"),
              phone: result.data
            }
          }
        }
      }
    });
    const client  = twilio(process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      body: `[SISSOU] 당신의 인증번호는 ${token}입니다.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: process.env.MY_PHONE_NUMBER! //원래는 to: result.data
    });
      return {
        token: true,
        phone: result.data //PHONE_NUMBER
      };
    }
  }else{
    const tokenResult = await tokenSchema.spa(token);
    const phoneResult = phoneSchema.safeParse(prevState.phone);
    if(!tokenResult.success){
      return{
        ...prevState,
        error: tokenResult.error.flatten()
      }
    }else{
      const token = await db.sMSToken.findUnique({
        where:{
          token: tokenResult.data.toString(),
          user: {
            phone: phoneResult.data
          }
        },
        select: {
          id: true,
          userId: true,
          phone: true
        }
      });
    
        await updateSession(token!.userId);
        await db.sMSToken.delete({
          where: {
            id: token!.id
        },
      });
      redirect("/profile");
    }
  }
};