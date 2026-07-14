import type { CSSProperties } from 'react';

interface ImagePlaceholderProps {
  label: string;
  shape?: 'rect' | 'circle' | 'rounded';
  radius?: number;
  style?: CSSProperties;
  src?: string;
}

export function ImagePlaceholder({ label, shape = 'rect', radius = 16, style, src }: ImagePlaceholderProps) {
  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? `${radius}px` : '0px';

  if (src) {
    return (
      <img
        src={src}
        alt={label}
        className="image-placeholder__img"
        style={{ borderRadius, ...style }}
      />
    );
  }

  return (
    <div className="image-placeholder" style={{ borderRadius, ...style }}>
      {label}
    </div>
  );
}
