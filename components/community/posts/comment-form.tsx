"use client";

import { uploadComment } from "@/app/posts/[id]/actions";
import { startTransition, useActionState, useOptimistic } from "react";
import CommentList from "./comment-list";
import CommentInput from "./comment-input";

export interface CommentFormProps{
  id: number;
  payload: string;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
  created_at: Date;
};

export default function CommentForm({id, sessionId, comments, user}: {
  id: number;
  sessionId: number;
  comments: CommentFormProps[];
  user: {
    username: string;
    avatar: string | null;
  }
}){
  const [state, reduceFn] = useOptimistic(comments, (prevState, payload: CommentFormProps)=> [...prevState, payload]);

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interceptAction = async(_: any, formData: FormData)=>{
    const payload = formData.get("payload") as string;
    const newComment = {
      payload,
      id,
      created_at: new Date(),
      userId: sessionId,
      user: {
        username: user.username,
        avatar: user.avatar
      }
    };

    startTransition(()=>{
      reduceFn(newComment);
    });

    formData.append("postId", id.toString());
    const res = await uploadComment(_, formData);

    return res;
  };

  const [formState, action] = useActionState(interceptAction, null);

  return(
    <div>
      {/* CommentList */}
      <div className="pb-16 md:pb-20">
        {state.map((comment, index)=>(
          <CommentList key={`${comment.id}-${index}`} 
          id={comment.id} payload={comment.payload} userId={comment.userId} user={comment.user} created_at={comment.created_at} sessionId={sessionId}/>
        ))}
      </div>
      {/* CommentInput */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full
      z-10 mode-svg-color-50 backdrop-blur-lg shadow-[0_-8px_32px_rgba(0,0,0,0.03)]">
        <div className="h-[0.0625rem] w-full ring-color opacity-70 mb-3"/>

        <div className="mx-auto max-w-screen-xs sm:max-w-lg md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl">
          <form action={action}>
            <CommentInput name="payload" placeholder="Write . . ."
            type="text"required errors={formState?.fieldErrors?.payload}/>
          </form>
        </div>
      </div>
  </div>
  );
}