import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  premium?: boolean;
  children: React.ReactNode;
}

export function Card({ children, premium, className, style, ...props }: CardProps) {
  return (
    <div
      className={[premium ? 'card-premium' : 'card', className].filter(Boolean).join(' ')}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, style, className, ...props }: CardProps) {
  return (
    <div className={['card-header', className].filter(Boolean).join(' ')} style={style} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, style, ...props }: CardProps) {
  return (
    <h3 className="card-title" style={style} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <div className="card-content" style={style} {...props}>
      {children}
    </div>
  );
}
