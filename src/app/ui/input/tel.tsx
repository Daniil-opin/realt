"use client";

import clsx from "clsx";
import { InputProps } from "@/app/lib/definitions";

interface InputTelProps extends InputProps {
  value: string;
  onChange: (value: string) => void;
}

export function InputTel({
  id,
  placeholder,
  label,
  error,
  value,
  onChange,
}: InputTelProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "");

    if (input.length > 9) {
      input = input.substring(0, 9);
    }

    let formattedInput = "";

    if (input.length === 0) {
      formattedInput = "";
    } else if (input.length <= 2) {
      formattedInput = input;
    } else if (input.length <= 5) {
      formattedInput = `${input.substring(0, 2)} ${input.substring(2)}`;
    } else if (input.length <= 7) {
      formattedInput = `${input.substring(0, 2)} ${input.substring(2, 5)}-${input.substring(5)}`;
    } else {
      formattedInput = `${input.substring(0, 2)} ${input.substring(2, 5)}-${input.substring(5, 7)}-${input.substring(7, 9)}`;
    }

    onChange(formattedInput);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-black">
        {label}
      </label>
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 transform text-sm leading-none text-black">
          +375
        </span>
        <input
          id={id}
          placeholder={placeholder}
          type="tel"
          value={value}
          onChange={handleInputChange}
          className={clsx(
            "focus:border-primary w-full rounded-lg border py-4 pl-12 pr-4 text-sm leading-none placeholder:text-sm placeholder:text-greyblue focus:outline-none",
            {
              "border-red-500": error,
              "border-light-grey-blue": !error,
            },
          )}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
