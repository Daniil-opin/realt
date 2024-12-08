// components/InputNumber.tsx
"use client";

import { useRef } from "react";
import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";

export interface ExtendedInputProps extends InputProps {
  allowDecimal?: boolean;
}

export function InputNumber({
  id,
  placeholder,
  label,
  register,
  error,
  allowDecimal = false,
}: ExtendedInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbiddenKeys = ["e", "E", "+", "-"];

    if (forbiddenKeys.includes(e.key)) {
      e.preventDefault();
    }

    if (allowDecimal && e.key === ".") {
      const currentValue = e.currentTarget.value;
      if (currentValue.includes(".")) {
        e.preventDefault();
      }
    }

    if (!allowDecimal && e.key === ".") {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text");

    const decimalPattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g;

    if (decimalPattern.test(pasteData)) {
      e.preventDefault();
    } else if (allowDecimal) {
      const input = e.currentTarget;
      const currentValue = input.value;
      const pastedValue = pasteData;

      if (currentValue.includes(".") && pastedValue.includes(".")) {
        e.preventDefault();
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let pattern: RegExp;

    if (allowDecimal) {
      pattern = /[^0-9.]/g;
      const parts = e.target.value.split(".");
      if (parts.length > 2) {
        e.target.value = parts[0] + "." + parts.slice(1).join("");
      }
    } else {
      pattern = /[^0-9]/g;
    }

    e.target.value = e.target.value.replace(pattern, "");
  };

  return (
    <BaseInput
      id={id}
      label={label}
      placeholder={placeholder}
      type="text"
      error={error}
      {...register}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      ref={inputRef}
    />
  );
}
