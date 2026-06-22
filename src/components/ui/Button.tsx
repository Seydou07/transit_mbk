'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => {
    const cls = [
      'btn',
      variant === 'primary' ? 'btn-primary btn-premium' : '',
      variant === 'secondary' ? 'btn-secondary' : '',
      variant === 'danger' ? 'btn-danger' : '',
      variant === 'success' ? 'btn-success' : '',
      variant === 'ghost' ? 'btn-ghost' : '',
      size === 'sm' ? 'btn-sm' : '',
      size === 'md' ? 'btn-md' : '',
      size === 'lg' ? 'btn-lg' : '',
      className || '',
    ].filter(Boolean).join(' ');

    return (
      <button 
        ref={ref} 
        className={cls} 
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin" style={{ width: '16px', height: '16px', marginRight: '8px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
