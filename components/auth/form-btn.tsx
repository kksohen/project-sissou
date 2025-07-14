"use client";

import { useFormStatus } from "react-dom";

interface FormBtnProps {
  text: string;
};

export default function FormBtn({text}: FormBtnProps) {
  const {pending} = useFormStatus();
  /* useFormStatus : form 전송 상태 알려주는 react-hook.
  로딩 중으로 버튼 이중클릭 막기. form의 자식태그에서만 사용가능(FormBtn에서 사용ㅇ) */

  return (
    <button data-cursor-target
    disabled={pending}
    className={`py-2 border-custom-all mode-svg-color transition-all 
    rounded-lg font-weight-custom text-xl tracking-wide form-btn-text
    ${pending ? "mode-secondary-50 backdrop-blur-lg cursor-not-allowed" : "mode-secondary"}`}>{pending ? "Loading..." : text}</button>
  );
};