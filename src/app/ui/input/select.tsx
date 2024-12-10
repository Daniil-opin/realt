import React, { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

interface SelectOption {
  value: string;
  label: string;
  iconSrc?: string;
  iconComponent?: React.ReactNode;
}

interface CustomSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  error?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  options,
  placeholder,
  className = "",
  error,
  ...rest
}) => {
  return (
    <div className={`relative h-[54px] ${className}`}>
      <select
        id={id}
        {...rest}
        className={clsx(
          "block min-h-full w-full min-w-24 appearance-none rounded-lg border px-4 py-2 text-sm leading-none text-black focus:border-blue focus:outline-none",
          {
            "border-red-500": error,
            "border-smooth": !error,
          },
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black" />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;
