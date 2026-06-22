'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  footer?: React.ReactNode;
  noScroll?: boolean;
}

export function Modal({ open, onClose, title, children, size = 'lg', footer, noScroll = false }: ModalProps) {
  const { sidebarWidth } = useSidebar();
  const widthMap: Record<string, string> = {
    sm: '480px',
    md: '640px',
    lg: '840px',
    xl: '1000px',
    '2xl': '1140px'
  };

  return (
    <Dialog.Root open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            backgroundColor: 'rgba(2, 6, 23, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.15s ease-out',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            left: `calc(50% + ${sidebarWidth / 2}px)`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: widthMap[size],
            width: '100%',
            maxHeight: '95vh',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.4)',
            border: 'none',
            zIndex: 51,
            animation: 'scaleIn 0.2s ease-out',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',

          }}
          onInteractOutside={e => e.preventDefault()}
        >
          <div style={{
            backgroundColor: '#0077B6',
            color: 'white',
            padding: '1.125rem 1.5rem',
            position: 'sticky', top: 0, zIndex: 50,
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <Dialog.Title style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: 'white',
            }}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button style={{
                width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.8)',
                transition: 'all 0.15s ease',
              }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'; e.currentTarget.style.color = 'white'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}>
                <X size={16} strokeWidth={2.5} />
              </button>
            </Dialog.Close>
          </div>
          <div style={{
            padding: '1.75rem',
            backgroundColor: '#F8FAFC',
            overflowY: noScroll ? 'visible' : 'auto',
            overflowX: 'hidden',
            flex: 1,
          }}>
            {children}
          </div>
          {footer && (
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
              backgroundColor: '#fff',
              flexShrink: 0,
            }}>
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
