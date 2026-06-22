import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  variant?: 'default' | 'search';
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, variant = 'default', onClear, className, ...props }, ref) => {
    const id = useId();
    const hasValue = !!props.value || !!props.defaultValue;

    return (
      <div className="form-group">
        {label && <label className="form-label" htmlFor={id}>{label}</label>}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-400)'
            }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className="form-input"
            style={{
              paddingLeft: leftIcon ? '2.75rem' : '1rem'
            }}
            autoComplete="off"
            {...props}
          />
          {variant === 'search' && hasValue && onClear && (
            <button type="button" onClick={onClear} style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--slate-400)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        {error && <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>{error}</div>}
      </div>
    );
  }
);
Input.displayName = 'Input';
