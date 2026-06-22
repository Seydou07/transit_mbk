'use client';

import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  sidebarWidth: number;
  setSidebarWidth: (w: number) => void;
}

const SidebarContext = createContext<SidebarContextType>({ sidebarWidth: 270, setSidebarWidth: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(270);
  return (
    <SidebarContext.Provider value={{ sidebarWidth, setSidebarWidth }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
