"use server";

import { EMAIL_ERROR } from "@/lib/constants";
import { z } from "zod";
import validator from "validator";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  type: z.string().min(1, "문의하실 프로젝트 유형을 선택해주세요."),
  details: z.string().min(15, "프로젝트 세부사항을 최소 15자 이상 작성해주세요.").refine(value => value.trim().length > 0, "프로젝트 세부사항을 작성해주세요."),
  deadline: z.string().optional().transform(value => value && value !== "" ? new Date(value) : undefined),
  budget: z.string().optional(),
  company: z.string().min(1, "기업명 혹은 소속을 기입해주세요."),
  name: z.string().min(1, "담당자명을 기입해주세요."),
  email: z.string().email(EMAIL_ERROR).toLowerCase(),
  phone: z.string().min(1, "연락처를 기입해주세요.").trim().refine(
    (phone)=> validator.isMobilePhone(phone, "ko-KR"), "올바른 전화번호 형식이 아닙니다."
  ),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function contactAction(prevState: any, formData: FormData){
  const data = {
    type: formData.get("type"),
    details: formData.get("details"),
    deadline: formData.get("deadline") as string,
    budget: formData.get("budget"),
    company: formData.get("company"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  };

  const result = contactSchema.safeParse(data);
  if(!result.success){
    const flattenedErrors = result.error.flatten();

    return {
      error: result.error.flatten(),
      formErrors: flattenedErrors.formErrors,
      success: false
    };
  };
  
  if(!process.env.GOOGLE_EMAIL || !process.env.GOOGLE_APP_PASSWORD){
    return{
      success: false,
      message: "서버 설정 오류가 발생했습니다.",
      formErrors: ["서버 설정을 확인해주세요."] 
    };
  };

  //SMTP 서버 이용한 email 전송 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD
    },
    secure: true,
    port: 465,
    tls: {
      rejectUnauthorized: false
    }
  });

  try{
    await transporter.verify();

    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: "sh206304@gmail.com",
      subject: `[New Contact] ${result.data.type} - ${result.data.company}`,
      html: `
        <h2>새로운 프로젝트 문의가 접수되었습니다.</h2>

        <hr>

        <p><strong>Type:</strong> ${result.data.type}</p>
        <p><strong>Company:</strong> ${result.data.company}</p>
        <p><strong>Name:</strong> ${result.data.name}</p>
        <p><strong>E-Mail:</strong> ${result.data.email}</p>
        <p><strong>Phone:</strong> ${result.data.phone}</p>
        
        <p><strong>Details:</strong></p>
        <p>${result.data.details.replace(/\n/g, "<br>")}</p>

        ${result.data.deadline ? `<p><strong>Deadline:</strong> ${new Date(result.data.deadline).toLocaleDateString()}</p>` : ""}
        ${result.data.budget ? `<p><strong>Budget:</strong> ${result.data.budget}</p>` : ""}
        
        <hr>
        <p><small>이 메일은 SISSOU에서 발송되었습니다.</small></p>
      `
    };

    await transporter.sendMail(mailOptions);

    return{
      success: true,
      message: "문의가 성공적으로 접수되었습니다! Thank You."
    };

  }catch(error){
    console.error(error);
    return{
      success: false,
      message: "전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      formErrors: ["메일 전송에 실패했습니다."]
    };
  };
}