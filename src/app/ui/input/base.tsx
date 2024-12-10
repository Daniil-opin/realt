// components/input/base.tsx
"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  ({ id, label, error, className, ...props }, ref) => {
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
            className,
          )}
          ref={ref}
          {...props} // Распространяет value, onChange, name и другие пропсы
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

BaseInput.displayName = "BaseInput";

export default BaseInput;
