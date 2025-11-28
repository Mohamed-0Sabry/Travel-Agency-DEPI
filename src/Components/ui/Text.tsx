import type { JSX } from "react";
import React from "react";

export type TextProps = {
  className?: string;
  type?: 'Header' | 'SubHeader' | 'Paragraph' | 'Highlight' | 'Inverted' | 'Label';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  flow?: 'Block' | 'Inline' | 'InlineBlock';
  children?: React.ReactNode;
  invertedWithBg?: boolean;
};

export const Text: React.FC<TextProps> = ({
  className = '',
  type = 'Paragraph',
  size = 'md',
  flow = 'Block',
  children,
  invertedWithBg = false,
}) => {
  const base = 'transition-all';

  const typeClasses: Record<NonNullable<TextProps['type']>, string> = {
    Header: 'fw-bold text-dark',
    SubHeader: 'fw-semibold text-dark',
    Paragraph: 'lh-base',
    Highlight: 'bg-success text-white d-inline-block rounded px-2 py-1',
    Inverted: invertedWithBg 
      ? 'text-white bg-dark d-inline-block rounded px-2 py-1' 
      : 'text-white',
    Label: 'text-success fw-semibold text-uppercase',
  };

  const sizeClasses: Record<NonNullable<TextProps['size']>, string> = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-4',
    xl: 'fs-3',
    '2xl': 'fs-2',
    '3xl': 'fs-1',
    '4xl': 'display-6',
    '5xl': 'display-4',
    '6xl': 'display-1',
  };

  const sizeClass = type === 'Label' && !size ? 'small' : sizeClasses[size];

  const tagMap: Record<NonNullable<TextProps['type']>, keyof JSX.IntrinsicElements> = {
    Header: 'h1',
    SubHeader: 'h2',
    Paragraph: 'p',
    Highlight: 'span',
    Inverted: 'p',
    Label: 'span',
  };

  const tag = flow === 'Inline' || flow === 'InlineBlock' ? 'span' : tagMap[type];

  const flowClass = flow === 'InlineBlock' ? 'd-inline-block' : '';

  const classes = `${base} ${typeClasses[type]} ${sizeClass} ${flowClass} ${className}`.trim();

  return React.createElement(tag, { className: classes }, children);
};