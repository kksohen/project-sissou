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
      <input 
      ref = {ref}
      {...props}
      name={name}
      className="font-weight-basic text-2xl form-h2 username-spacing
      w-full h-10 mx-auto transition-all
      focus:outline-none border-none bg-transparent 
      form-text-color placeholder:text-[var(--form-text-color)]
      placeholder:opacity-30
      font-weight-form"/>

      {errors.map((error, index)=>(
        <span key={index} className="color-warning text-xs md:text-sm font-weight-form">{error}</span>
      ))}
    </div>
  );
};

export default forwardRef(_FormInput);