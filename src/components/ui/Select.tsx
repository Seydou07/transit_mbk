'use client';

import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export function Select({ label, value, onChange, options, placeholder, error }: SelectProps) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onChange}>
        <RadixSelect.Trigger className="form-select" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RadixSelect.Value placeholder={placeholder || 'Sélectionner...'} />
          <RadixSelect.Icon>
            <ChevronDown size={18} color="var(--slate-400)" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content 
            style={{ 
              background: 'var(--white)', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid var(--slate-200)',
              overflow: 'hidden',
              zIndex: 1000
            }}
            position="popper" 
            sideOffset={8}
          >
            <RadixSelect.Viewport style={{ padding: '0.5rem' }}>
              {options.map(opt => (
                <RadixSelect.Item 
                  key={opt.value} 
                  value={opt.value} 
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--slate-700)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-50)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator><Check size={16} color="var(--fleet-blue)" /></RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>{error}</div>}
    </div>
  );
}
