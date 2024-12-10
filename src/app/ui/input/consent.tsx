"use client";

import { InputProps } from "@/app/lib/definitions";
import { ChangeEventHandler } from "react";

export function InputCheckbox({
  label,
  id,
  register,
  error,
  className = "text-sm",
  width = 20,
  height = 20,
  checked,
  onChange = () => {},
}: InputProps & {
  className?: string;
  width?: number;
  height?: number;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex cursor-pointer items-center" style={{ width, height }}>
      <label className="flex cursor-pointer items-center">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only absolute h-0 w-0 opacity-0"
          checked={checked}
          onChange={onChange}
          {...register}
        />
        <span
          className={`flex items-center justify-center rounded-md border-[1px] border-greyblue text-sm text-white peer-checked:border-blue peer-checked:text-blue ${
            error ? "border-red-500" : "border-smooth"
          }`}
          style={{
            width: width ? `${width}px` : undefined,
            height: height ? `${height}px` : undefined,
          }}
        >
          <svg
            className="flex items-center justify-center"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15.7069 6.29279C15.5192 6.10532 15.2646 6 14.9992 6C14.7337 6 14.4792 6.10532 14.2914 6.29279L7.99187 12.5858L5.69648 10.2928C5.50768 10.1106 5.25481 10.0098 4.99234 10.0121C4.72987 10.0144 4.4788 10.1196 4.2932 10.305C4.1076 10.4904 4.00232 10.7412 4.00004 11.0034C3.99776 11.2656 4.09866 11.5182 4.281 11.7068L7.28413 14.7068C7.47186 14.8943 7.72643 14.9996 7.99187 14.9996C8.25731 14.9996 8.51188 14.8943 8.69961 14.7068L15.7069 7.70679C15.8946 7.51926 16 7.26495 16 6.99979C16 6.73462 15.8946 6.48031 15.7069 6.29279Z" />
          </svg>
        </span>
        <span className={`ml-2 ${className} text-black`}>{label}</span>
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
