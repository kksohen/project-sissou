import { EMAIL_ERROR, PASSWORD_MIN_LENGTH, PASSWORD_MIN_LENGTH_ERROR, USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR, USERNAME_REGEX } from "@/lib/constants";
import { z } from "zod";
import { checkEmailAvailable, checkPhoneAvailable, checkUsernameAvailable } from "./actions";
import validator from 'validator';

const checkUsername = (username: string)=> {
  const regex = USERNAME_REGEX;
  return regex.test(username);
};

const validDomains = [
  "gmail.com",
  "naver.com",
  "daum.net",
  "nate.com",
  "hanmail.net",
];

const checkEmail = async (email: string) => {
  const domain = email.split("@")[1];
  return validDomains.includes(domain);
};

export const profileSchema = z.object({
  username: z.string({
      invalid_type_error: "이름은 문자여야 합니다.",
      required_error: "이름을 입력해주세요.",
    }).min(USERNAME_MIN_LENGTH, USERNAME_MIN_LENGTH_ERROR)
    .toLowerCase()
    .trim()
    .refine(checkUsername, "사용할 수 없는 이름입니다."),
  email: z.string()
  .transform(val => val.trim() === "" ? undefined : val)
  .optional()
  .refine(val => val === undefined || z.string().email().safeParse(val).success, EMAIL_ERROR)
  ,password: z.string()
  .transform(val => val.trim() === "" ? undefined : val)
  .optional(),
  confirm_password: z.string()
  .transform(val => val.trim() === "" ? undefined : val)
  .optional(),
  phone: z.string()
  .transform(val => val.trim() === "" ? undefined : val)
  .optional(),
  avatar: z.string()
  .transform(val => val.trim() === "" ? undefined : val)
  .optional(),
});

export const profileSchemaFn = (currentUserId: number) =>
  profileSchema.superRefine(async({username, email, phone, password, confirm_password}, ctx)=>{
    const usernameTaken = await checkUsernameAvailable(username, currentUserId);
    if(usernameTaken){
      ctx.addIssue({
        code: "custom",
        message: "이미 사용 중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });
      
      return z.NEVER;
    }

    if(email){
      const isValid = await checkEmail(email);
      if(!isValid){
        ctx.addIssue({
          code: "custom",
          message: "gmail.com, naver.com, daum.net, nate.com, hanmail.net 중 하나의 이메일을 사용해주세요.",
          path: ["email"],
        });
      }

      const emailTaken = await checkEmailAvailable(email, currentUserId);
      if(emailTaken){
        ctx.addIssue({
          code: "custom",
          message: "이미 사용 중인 이메일입니다.",
          path: ["email"],
          fatal: true,
        });
      }
    }
    
    if(phone){
      const isValid = validator.isMobilePhone(phone, "ko-KR");
      if(!isValid){
        ctx.addIssue({
          code: "custom",
          message: "올바른 전화번호 형식이 아닙니다.",
          path: ["phone"],
        });
      }

      const phoneTaken = await checkPhoneAvailable(phone, currentUserId);
      if(phoneTaken){
        ctx.addIssue({
          code: "custom",
          message: "이미 사용 중인 전화번호입니다.",
          path: ["phone"]
        });
      }
    }
    
    if(password || confirm_password){
      if(!password || password.length < PASSWORD_MIN_LENGTH){
        ctx.addIssue({
          code: "custom",
          message: PASSWORD_MIN_LENGTH_ERROR,
          path: ["password"],
        });
      }

      if(password !== confirm_password){
        ctx.addIssue({
          code: "custom",
          message: "비밀번호가 일치하지 않습니다.",
          path: ["confirm_password"],
        });
      }
    }
  });

export type ProfileType = z.infer<typeof profileSchema>;