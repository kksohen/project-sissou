import { z } from "zod";

export const commentSchema = z.object({
  payload: z.string({
    required_error: "댓글을 작성해 주세요.",
  }).trim().min(1, "댓글은 최소 1자 이상이어야 합니다.").max(500, "댓글은 500자 이하로 작성해 주세요."),
  postId: z.string({}).min(1, "게시글 ID가 유효하지 않습니다."),
});