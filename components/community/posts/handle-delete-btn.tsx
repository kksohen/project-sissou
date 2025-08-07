"use client";

import { useRouter } from "next/navigation";
import { deletePost } from "@/app/posts/[id]/actions";
import Link from "next/link";

interface HandleDeleteBtnProps{
  isOwner?: boolean;
  postId?: number;
};

export default function HandleDeleteBtn({isOwner = false, postId}: HandleDeleteBtnProps) {
  const router = useRouter();
  
  async function handleDelete(){
    if (!postId) return;

    const confirmed = window.confirm("삭제하시겠습니까?");
    if(!confirmed) return;

    const res = await deletePost(postId);
    if(res){
      alert("삭제되었습니다.");
      router.replace("/community");
    }else{
      alert("삭제에 실패했습니다.");
    };
  };

  return(
    <>
      {isOwner &&
      <div className="flex items-center gap-2.5">
        <Link href={`/posts/${postId}/edit`}>
          <button data-cursor-target
          className="flex items-center justify-center rounded-full 
          mode-secondary mode-svg-color transition-all
          size-8 md:size-10 lg:size-12
          hover:bg-primary
          ">
            <svg fill="currentColor" className="pointer-none"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87 87">
              <path d="M19.11,55.78c-1.562,1.562-1.562,4.095,0,5.657,1.562,1.562,4.095,1.562,5.657,0s1.562-4.095,0-5.657-4.095-1.562-5.657,0Z"/><path d="M28.61,55.78c-1.562,1.562-1.562,4.095,0,5.657,1.562,1.562,4.095,1.562,5.657,0s1.562-4.095,0-5.657-4.095-1.562-5.657,0Z"/><path d="M24.766,46.28c-1.562-1.562-4.095-1.562-5.657,0-1.562,1.562-1.562,4.095,0,5.657,1.562,1.562,4.095,1.562,5.657,0s1.562-4.095,0-5.657Z"/><polygon points="50.409 37.902 55.023 28.239 67.478 20.144 59.004 12 51.408 24.765 41.936 29.758 28.689 52.019 50.409 37.902"/><polygon points="60.241 65.385 15.137 65.385 15.137 32.934 34.082 32.934 34.082 30.319 12.522 30.319 12.522 32.934 12.522 68 62.856 68 62.856 49.084 60.241 49.084 60.241 65.385"/>
            </svg>
          </button>
        </Link>

        <button onClick={handleDelete} data-cursor-target
        className="flex items-center justify-center rounded-full 
        mode-secondary mode-svg-color transition-all
        size-8 md:size-10 lg:size-12
        hover:bg-error">
          <svg fill="currentColor" className="pointer-none"
          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86 86">
            <polygon points="64.647 49.084 64.647 65.385 19.543 65.385 19.543 49.084 16.929 49.084 16.929 68 67.262 68 67.262 49.084 64.647 49.084"/><path d="M47.442,23.11c.648-1.097,1.021-2.376,1.021-3.742,0-4.069-3.299-7.368-7.368-7.368s-7.368,3.299-7.368,7.368c0,1.847.684,3.53,1.807,4.823l-22.795,19.77,1.353,2.217,37.797-15.855s-3.779-6.113-4.445-7.213ZM43.787,20.742c-.503.982-1.513,1.661-2.692,1.661-.915,0-1.726-.414-2.283-1.055-.462-.533-.752-1.219-.752-1.98,0-1.676,1.359-3.035,3.035-3.035s3.035,1.359,3.035,3.035c0,.497-.131.96-.343,1.374Z"/><path d="M32.549,61.437c1.562,1.562,4.095,1.562,5.657,0s1.562-4.095,0-5.657-4.095-1.562-5.657,0c-1.562,1.562-1.562,4.095,0,5.657Z"/><path d="M44.924,54.72c1.562-1.562,1.562-4.095,0-5.657-1.562-1.562-4.095-1.562-5.657,0s-1.562,4.095,0,5.657c1.562,1.562,4.095,1.562,5.657,0Z"/><path d="M51.641,61.437c1.562-1.562,1.562-4.095,0-5.657-1.562-1.562-4.095-1.562-5.657,0s-1.562,4.095,0,5.657,4.095,1.562,5.657,0Z"/><path d="M38.206,48.002c1.562-1.562,1.562-4.095,0-5.657-1.562-1.562-4.095-1.562-5.657,0-1.562,1.562-1.562,4.095,0,5.657,1.562,1.562,4.095,1.562,5.657,0Z"/><path d="M51.641,42.345c-1.562-1.562-4.095-1.562-5.657,0-1.562,1.562-1.562,4.095,0,5.657,1.562,1.562,4.095,1.562,5.657,0,1.562-1.562,1.562-4.095,0-5.657Z"/>
          </svg>
        </button>
      </div>
      }
    </>
  );
}