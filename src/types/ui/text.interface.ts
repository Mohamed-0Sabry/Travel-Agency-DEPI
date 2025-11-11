export interface TextProps {
  className?: string;
  type?: "Header" | "SubHeader" | "Paragraph" | "Highlight" | "Inverted" | "Label";
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  flow?: "Block" | "Inline" | "InlineBlock";
  children: React.ReactNode;

  // optional: if true, we'll add a subtle rounded bg to inverted to ensure contrast when used alone
  invertedWithBg?: boolean;
}

