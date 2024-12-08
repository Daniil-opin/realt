"use client";

import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";

export function InputEmail({
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
      type="email"
      {...register}
      error={error}
    />
  );
}
