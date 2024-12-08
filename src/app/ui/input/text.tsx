"use client";

import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";

export function InputText({
  id,
  placeholder,
  label,
  register,
  error,
}: InputProps) {
  return (
    <BaseInput
      id={id}
      label={label}
      placeholder={placeholder}
      type="text"
      error={error}
      {...register}
    />
  );
}
