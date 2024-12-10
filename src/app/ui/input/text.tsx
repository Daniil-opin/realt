// components/input/text.tsx
"use client";

import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";

export function InputText({
  id,
  placeholder,
  label,
  register,
  error,
  ...rest
}: InputProps) {
  return (
    <BaseInput
      id={id}
      label={label}
      placeholder={placeholder}
      type="text"
      {...register} // Распространяет value, onChange, name и другие пропсы
      {...rest}
      error={error}
    />
  );
}
