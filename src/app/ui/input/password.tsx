"use client";

import { useEffect, useRef, useState } from "react";
import { InputProps } from "@/app/lib/definitions";
import BaseInput from "./base";
import { CloseEyeIcon, OpenEyeIcon } from "../icons/icons";

export function InputPassword({
  id,
  placeholder,
  label,
  register,
  error,
}: InputProps) {
  const [type, setType] = useState<"password" | "text">("password");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [type, isFocused]);

  const toggleType = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
    setIsFocused(!isFocused);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <div className="relative w-full">
        <BaseInput
          id={id}
          label={label}
          placeholder={placeholder}
          type={type}
          error={error}
          {...register}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            register?.onBlur({ target: e.target });
          }}
          className="py-4 pl-4 pr-14"
          ref={(e) => {
            register?.ref(e);
            inputRef.current = e;
          }}
        />
        {type === "password" ? (
          <CloseEyeIcon
            onClick={toggleType}
            fill={isFocused ? `#2F6FEB` : "#959FB3"}
            className="absolute right-4 top-10 cursor-pointer"
            aria-label="Показать пароль"
          />
        ) : (
          <OpenEyeIcon
            onClick={toggleType}
            fill={isFocused ? `#2F6FEB` : "#959FB3"}
            className="absolute right-4 top-10 cursor-pointer"
            aria-label="Скрыть пароль"
          />
        )}
      </div>
    </div>
  );
}
