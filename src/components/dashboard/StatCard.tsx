import React from 'react';

const cardColors = [
  { border: '#0077B6', iconBg: '#EFF6FF', text: '#0077B6' },
  { border: '#10B981', iconBg: '#ECFDF5', text: '#10B981' },
  { border: '#F59E0B', iconBg: '#FFFBEB', text: '#F59E0B' },
  { border: '#8B5CF6', iconBg: '#F5F3FF', text: '#8B5CF6' },
  { border: '#F43F5E', iconBg: '#FFF1F2', text: '#F43F5E' },
  { border: '#06B6D4', iconBg: '#ECFEFF', text: '#06B6D4' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  index?: number;
}

export function StatCard({ title, value, icon, change, index = 0 }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const changeStr = change !== undefined ? `${isPositive ? '+' : ''}${change}%` : null;
  const colors = cardColors[index % cardColors.length];

  return (
    <div className="card" style={{
      padding: '1rem 1.25rem',
      borderRadius: '16px',
      borderLeft: `4px solid ${colors.border}`,
      minHeight: '90px',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    }}
      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 24px -8px ${colors.border}33`; }}
      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 900, color: colors.text, letterSpacing: '-0.03em', lineHeight: '1' }}>{value}</span>
        </div>
        <div className="icon-box" style={{
          width: '36px', height: '36px',
          background: colors.iconBg,
          color: colors.border,
          borderRadius: '10px',
          position: 'relative', zIndex: 1,
        }}>
          {icon}
        </div>
      </div>
      {changeStr && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', position: 'relative', zIndex: 1 }}>
          <span style={{ color: isPositive ? '#10B981' : '#EF4444', fontWeight: 700 }}>
            {isPositive ? '↑' : '↓'} {changeStr}
          </span>
          <span style={{ color: '#94A3B8' }}>vs mois dernier</span>
        </div>
      )}
    </div>
  );
}
