"use client";
import { deleteCommentAction } from "@/app/(tabs)/community/posts/[id]/actions";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";

interface CommentDeleteProps{
  commentId: number;
};

export default  function CommentDelete({commentId}: CommentDeleteProps){
  async function handleDelete(){
    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed) return;

    const res = await deleteCommentAction(commentId);
    if(res){
      alert("삭제되었습니다.");
    }else{
      alert("삭제에 실패했습니다.");
    };
  };

  return(
    <button onClick={handleDelete} data-cursor-target
    className="flex items-center">
      <EllipsisHorizontalIcon className="size-5 pointer-none"/>
    </button>
  );
}