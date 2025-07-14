import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps{
  errors?: string[];
  name: string;
};

const _FormInput = ({errors=[], name,
  ...props
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>, 
ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
      <input data-cursor-target
      ref = {ref}
      {...props}
      name={name}
      className="form-bg-color w-full h-10 mx-auto transition-all
      focus:outline-none border-none 
      ring-[0.0625rem] ring-[var(--ring-color)]
      focus:ring-[var(--form-text-color)]
      form-text-color placeholder:text-[var(--form-text-color)]
      placeholder:opacity-30
      pl-3 font-weight-form rounded-md"/>

      {errors.map((error, index)=>(
        <span key={index} className="color-warning text-xs md:text-sm font-weight-form pl-3">{error}</span>
      ))}
    </div>
  );
};

export default forwardRef(_FormInput);