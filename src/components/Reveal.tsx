import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delayMs?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Reveal({ children, as: Tag = 'div', delayMs = 0, className, style, id }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: `opacity 0.8s ease ${delayMs}ms, transform 0.8s ease ${delayMs}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
