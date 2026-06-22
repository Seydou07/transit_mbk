import React from 'react';

interface FormSectionProps {
  title: string;
  pastilleColor: string;
  textColor: string;
  icon?: React.ReactNode;
  iconBg?: string;
  children: React.ReactNode;
}

export function FormSection({ title, pastilleColor, textColor, icon, iconBg, children }: FormSectionProps) {
  return (
    <div className="modal-form-block">
      <div className="modal-form-block-header">
        <div className="modal-form-block-pastille" style={{ backgroundColor: pastilleColor }} />
        {icon && (
          <div className="modal-form-block-icon" style={{ backgroundColor: iconBg || `${pastilleColor}15` }}>
            {icon}
          </div>
        )}
        <span className="modal-form-block-title" style={{ color: textColor }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );
}
