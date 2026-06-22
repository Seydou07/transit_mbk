import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children, style, className, ...props }: BadgeProps) {
  const cls = [
    'badge',
    `badge-${variant}`,
    className || '',
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} style={style} {...props}>
      {children}
    </span>
  );
}
