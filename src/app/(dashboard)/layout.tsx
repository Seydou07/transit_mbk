import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { ContentArea } from '@/components/layout/ContentArea';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'transparent' }}>
        <Sidebar />
        <ContentArea>
          <Header />
          <main style={{ flex: 1, padding: '2rem' }}>
            {children}
          </main>
        </ContentArea>
      </div>
    </SidebarProvider>
  );
}
