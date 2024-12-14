// components/input/number.tsx
"use client";

import React from "react";
import clsx from "clsx";

interface InputNumberProps {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  allowDecimal?: boolean;
}

export function InputNumber({
  id,
  placeholder,
  label,
  value,
  onChange,
  error,
  allowDecimal = false,
  ...rest
}: InputNumberProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const forbiddenKeys = ["e", "E", "+", "-"];

    if (forbiddenKeys.includes(e.key)) {
      e.preventDefault();
    }

    if (allowDecimal && e.key === ".") {
      if (value.includes(".")) {
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
      if (value.includes(".") && pasteData.includes(".")) {
        e.preventDefault();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Разрешить только цифры и одну точку, если разрешено
    let newValue = inputValue.replace(/[^0-9.]/g, "");
    if (!allowDecimal) {
      newValue = newValue.replace(".", "");
    } else {
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    onChange(newValue);
  };

  return (
    <div className="flex w-full flex-col items-start justify-start">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-black"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          "w-full rounded-lg border px-4 py-4 text-sm placeholder:text-sm placeholder:text-greyblue focus:border-blue focus:outline-none",
          {
            "border-red-500": error,
            "border-smooth": !error,
          },
        )}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
