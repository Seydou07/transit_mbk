'use client';

import { useSidebar } from '@/contexts/SidebarContext';

export function ContentArea({ children }: { children: React.ReactNode }) {
  const { sidebarWidth } = useSidebar();
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      marginLeft: `${sidebarWidth}px`,
      transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      {children}
    </div>
  );
}
