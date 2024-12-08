import { UseFormRegisterReturn } from "react-hook-form";

export interface InputProps {
  id: string;
  label: string;
  placeholder: string;
  register?: UseFormRegisterReturn;
  error?: string;
}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name?: string;
  id: string;
  label: string;
  error?: string;
}
