import { ForwardedRef, forwardRef, InputHTMLAttributes } from "react";

interface FormInputProps{
  errors?: string[];
  name: string;
};

const _FormInput = ({errors=[], name, type,
  ...props
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>, 
ref: ForwardedRef<HTMLInputElement>) => {

  const getInputClass = ()=>{
    let base = `w-full h-10 mx-auto transition-all
      focus:outline-none border-none
      placeholder:text-[var(--form-text-color)]
      placeholder:opacity-40
      font-weight-form`;

    //date custom styles
    if(type ==="date"){
      base += `
      [color-scheme:auto]
      [&::-webkit-calendar-picker-indicator]:opacity-30
      hover:[&::-webkit-calendar-picker-indicator]:opacity-100
      `;
    }

    return base;
  };
  
  return (
    <div className="flex flex-col gap-1">
      <input data-cursor-target
      ref = {ref}
      {...props}
      name={name}
      type={type}
      className={getInputClass()}/>

      {errors.map((error, index)=>(
        <p key={index} className="color-warning text-xs md:text-sm font-weight-form">{error}</p>
      ))}
    </div>
  );
};

export default forwardRef(_FormInput);