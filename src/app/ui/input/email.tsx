// components/input/email.tsx
"use client";

import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";

export function InputEmail({
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
      type="email"
      {...register} // Распространяет value, onChange, name и другие пропсы
      {...rest}
      error={error}
    />
  );
}
