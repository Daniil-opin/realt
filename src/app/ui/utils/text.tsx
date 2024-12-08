import { formatText } from "@/app/lib/utils";
import React from "react";

export interface FormattedTextProps {
  children: string;
}
export interface FormattedParagraphProps {
  children: string;
  className?: string;
}

export function FormattedText({ children }: FormattedTextProps) {
  const processedText = formatText(children);

  return processedText;
}

export function FormattedParagraph({
  children,
  className = "",
}: FormattedParagraphProps) {
  return children
    .toString()
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .map((paragraph, index) => (
      <p key={`${paragraph[0]}-${index}`} className={className}>
        <FormattedText>{paragraph}</FormattedText>
      </p>
    ));
}
