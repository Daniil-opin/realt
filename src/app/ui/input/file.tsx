import React from "react";
import { InputProps } from "@/app/lib/definitions";

interface InputFileImageProps extends Omit<InputProps, "placeholder"> {
  accept?: string;
  multiple?: boolean;
  name?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputFileImage = React.forwardRef<
  HTMLInputElement,
  InputFileImageProps
>(
  (
    {
      id,
      label,
      error,
      name,
      accept = "image/*",
      multiple = false,
      onChange,
      disabled = false,
      ...rest
    },
    ref,
  ) => (
    <div className="flex w-full flex-col items-start justify-start">
      {label && (
        <label htmlFor={id} className="mb-3 text-base leading-none text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={onChange}
        name={name || id}
        ref={ref}
        multiple={multiple}
        disabled={disabled}
        {...rest}
        className={`w-full rounded-xl border border-smooth bg-transparent px-4 py-4 text-sm placeholder:text-sm placeholder:text-greyblue focus:outline-none ${
          error ? "border-red-500" : "border-smooth"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ),
);

InputFileImage.displayName = "InputFileImage";
