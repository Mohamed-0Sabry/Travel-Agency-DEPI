import React, { type JSX } from "react";
import { cn } from "@/utils/cnhelper";
import type { TextProps } from "@/types/ui/text.interface";

const Text: React.FC<TextProps> = ({
  className,
  type = "Paragraph",
  size = "md",
  flow = "Block",
  children,
  invertedWithBg = false,
}) => {
  const base = "transition-colors duration-200";

  const typeStyles: Record<string, string> = {
    Header: "font-bold text-gray-900",
    SubHeader: "font-semibold text-gray-800",
    Paragraph: "text-gray-700 leading-relaxed",
    Highlight: "bg-primary text-white inline-block rounded px-2 py-0.5",
    Inverted: invertedWithBg
      ? "text-white bg-gray-900 inline-block rounded px-2 py-0.5"
      : "text-white",
    Label: "text-primary font-semibold tracking-wide uppercase",
  };

  const sizeStyles: Record<string, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
  };

  const sizeClass =
    type === "Label" && !size ? "text-xs" : sizeStyles[size] || "text-base";

  const tagMap: Record<string, keyof JSX.IntrinsicElements> = {
    Header: "h1",
    SubHeader: "h2",
    Paragraph: "p",
    Highlight: "span",
    Inverted: "p",
    Label: "span",
  };

  const tag =
    flow === "Inline" || flow === "InlineBlock"
      ? "span"
      : tagMap[type] || "p";

  const classes = cn(
    base,
    typeStyles[type],
    sizeClass,
    flow === "InlineBlock" && "inline-block",
    className
  );

  return React.createElement(tag, { className: classes }, children);
};

export default Text;
