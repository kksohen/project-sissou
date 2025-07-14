
import { POST_MAX_LENGTH_ERROR, POST_MIN_LENGTH_ERROR } from "@/lib/constants";
import { z } from "zod";

export const postSchema = z.object({
  photo: z.string({
    required_error: "이미지를 추가해주세요.",
  }),
  title: z.string({
    required_error: "제목을 기입해주세요.",
  }).max(15, POST_MAX_LENGTH_ERROR).min(2, POST_MIN_LENGTH_ERROR),
  description: z.string().max(500, "게시글은 500자 이하로 작성해 주세요.").optional()
});

export type PostType = z.infer<typeof postSchema>;