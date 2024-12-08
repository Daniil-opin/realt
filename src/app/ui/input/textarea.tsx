"use client";

import React, { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form"; // Если вы используете react-hook-form

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
}

const InputTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, className, register, ...props }, ref) => {
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
        <textarea
          id={id}
          ref={ref}
          rows={6}
          className={clsx(
            "custom-scrollbar w-full rounded-lg border px-4 py-3 text-sm placeholder:text-sm placeholder:text-greyblue focus:border-blue focus:outline-none",
            {
              "border-red-500": error,
              "border-gray-300": !error,
            },
            className,
          )}
          {...register}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

InputTextarea.displayName = "Textarea";

export default InputTextarea;
