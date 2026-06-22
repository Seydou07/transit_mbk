'use client';

import { Bell, Search, Menu, Moon, Sun } from 'lucide-react';

export function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '1rem 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          padding: '0.625rem', borderRadius: '16px',
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <Menu size={20} color="var(--text-secondary)" />
        </button>
        <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Tableau de bord</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button style={{
          padding: '0.625rem', borderRadius: '16px',
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <Moon size={20} color="var(--text-secondary)" />
        </button>

        <button style={{
          padding: '0.375rem 0.75rem', borderRadius: '12px',
          backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          transition: 'all 0.2s ease',
        }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--fleet-blue) 0%, #023E8A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.75rem',
          }}>A</div>
        </button>
      </div>
    </header>
  );
}
