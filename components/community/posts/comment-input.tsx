"use client";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { useFormStatus } from "react-dom";

interface CommentInputProps{
  errors?: string[];
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
};

export default function CommentInput({
errors, name, type, placeholder
}: CommentInputProps){
  const {pending} = useFormStatus();

  return(
    <div className="mb-5">
      <div className="relative mb-1">
        <input type={type} name={name} placeholder={placeholder}
        data-cursor-target
        className="w-full h-10 mx-auto
        focus:outline-none border-none
        ring-[0.0625rem] ring-[var(--ring-color)]
        focus:ring-[var(--form-text-color)]
        form-text-color placeholder:text-[var(--form-text-color)]
        placeholder:opacity-40
        pl-3 font-weight-form rounded-full"/>
        
        <button data-cursor-target
        disabled={pending}
        className="disabled:cursor-not-allowed transition-all absolute right-1 -translate-y-1/2 top-1/2">
          <ArrowUpCircleIcon className={`pointer-none size-8 ${pending ? "opacity-40" : "opacity-100"}`}/>
        </button>
      </div>
      
      {errors?.map((error, index)=>(
        <span key={index} className="color-warning text-xs md:text-sm font-weight-form pl-3">{error}</span>
      ))}
    </div>
  );
}