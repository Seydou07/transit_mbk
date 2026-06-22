'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, Ship, Container, Warehouse,
  FileText, BarChart3, Settings, UserCog, LogOut, Truck,
  Building2, Wallet, CreditCard, Receipt, ShoppingCart,
  Package, ClipboardList, LineChart, ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

const mainNavigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Fournisseurs', href: '/fournisseurs', icon: Building2 },
  { name: 'Expéditions', href: '/expeditions', icon: Ship },
  { name: 'Conteneurs', href: '/conteneurs', icon: Container },
  { name: 'Demandes d\'achat', href: '/demandes-achat', icon: ShoppingCart },
  { name: 'Achats fournisseur', href: '/achats-fournisseur', icon: Package },
  { name: 'Suivi production', href: '/suivi-production', icon: ClipboardList },
  { name: 'Stock', href: '/stock', icon: Warehouse },
  { name: 'Livraisons', href: '/livraisons', icon: Truck },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Dépenses', href: '/depenses', icon: Wallet },
  { name: 'Paiements', href: '/paiements', icon: CreditCard },
  { name: 'Factures', href: '/factures', icon: Receipt },
  { name: 'Finance conteneur', href: '/finance-conteneur', icon: LineChart },
  { name: 'Rapports', href: '/rapports', icon: BarChart3 },
];

const bottomNavigation = [
  { name: 'Utilisateurs', href: '/utilisateurs', icon: UserCog },
  { name: 'Paramètres', href: '/parametres', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { setSidebarWidth } = useSidebar();

  useEffect(() => { setSidebarWidth(collapsed ? 72 : 270); }, [collapsed, setSidebarWidth]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <div style={{
      width: collapsed ? '72px' : '270px',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 30,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#fff',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{
          padding: collapsed ? '1rem 0' : '1.25rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '0.75rem',
        }}>
          <img
            src="/images/logo-mbk.jpg"
            alt="MBK Business International"
            style={{
              width: collapsed ? '48px' : '60px',
              height: collapsed ? '48px' : '60px',
              borderRadius: '50%',
              objectFit: 'cover',
              flexShrink: 0,
              boxShadow: '0 4px 12px -2px rgba(0, 119, 182, 0.3)',
              transition: 'all 0.3s ease',
            }}
          />
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0077B6', letterSpacing: '-0.02em', lineHeight: '1.2', display: 'block' }}>MBK Transit</span>
              <span style={{ fontSize: '0.5625rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Logistics Hub</span>
            </div>
          )}
        </div>
      </Link>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', right: '-12px', top: '20px',
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#fff', border: '1px solid #E2E8F0',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#94A3B8', zIndex: 5,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
        }}
        onMouseOver={e => { e.currentTarget.style.color = '#0077B6'; e.currentTarget.style.borderColor = '#0077B6'; }}
        onMouseOut={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
      >
        <ChevronLeft size={14} style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
      </button>

      {/* Main navigation */}
      <nav style={{ flex: 1, padding: collapsed ? '0.5rem 0' : '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{
            padding: '0.5rem 0.75rem 0.5rem 0.75rem',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#94A3B8',
          }}>
            Navigation
          </div>
        )}
        {mainNavigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: collapsed ? '0.65rem 0' : '0.65rem 0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: collapsed ? '0' : '10px',
                color: active ? '#0077B6' : '#64748B',
                backgroundColor: active ? 'rgba(0, 119, 182, 0.08)' : 'transparent',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                borderRight: active ? '3px solid #0077B6' : '3px solid transparent',
                position: 'relative',
                marginLeft: collapsed ? '0' : '0',
              }}
              onMouseOver={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#334155'; }
                const iconEl = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }
                const iconEl = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1)';
              }}
            >
              <div className="nav-icon" style={{
                width: '20px', height: '20px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s ease',
              }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              </div>
              {!collapsed && item.name}
            </Link>
          );
        })}
        {collapsed && <div style={{ borderTop: '1px solid #E2E8F0', margin: '0.5rem 0.75rem' }} />}
        {!collapsed && (
          <div style={{
            padding: '0.5rem 0.75rem 0.5rem 0.75rem',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#94A3B8',
            marginTop: '0.5rem',
            borderTop: '1px solid #E2E8F0',
          }}>
            Système
          </div>
        )}
        {bottomNavigation.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: collapsed ? '0.65rem 0' : '0.65rem 0.75rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: collapsed ? '0' : '10px',
                color: active ? '#0077B6' : '#64748B',
                backgroundColor: active ? 'rgba(0, 119, 182, 0.08)' : 'transparent',
                fontWeight: 700,
                fontSize: '0.8125rem',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                borderRight: active ? '3px solid #0077B6' : '3px solid transparent',
                position: 'relative',
              }}
              onMouseOver={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.color = '#334155'; }
                const iconEl = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                if (!active) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#64748B'; }
                const iconEl = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
                if (iconEl) iconEl.style.transform = 'scale(1)';
              }}
            >
              <div className="nav-icon" style={{
                width: '20px', height: '20px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s ease',
              }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              </div>
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User profile */}
      <div style={{ padding: collapsed ? '0.75rem 0' : '0.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: collapsed ? 'center' : 'stretch' }}>
        {collapsed ? (
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0077B6, #023E8A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.75rem',
          }}>
            AD
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.25rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0077B6, #023E8A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0,
            }}>
              AD
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin</div>
              <div style={{ fontSize: '0.625rem', color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>admin@mbktransit.com</div>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div style={{ padding: collapsed ? '0.5rem 0' : '0.5rem 0.75rem', borderTop: '1px solid #E2E8F0' }}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'center', gap: '0.5rem', width: '100%',
            padding: collapsed ? '0.5rem 0' : '0.625rem 1rem',
            borderRadius: '10px',
            color: '#E11D48', backgroundColor: 'transparent',
            border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: collapsed ? '0.75rem' : '0.75rem',
            transition: 'all 0.15s ease',
          }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FFF1F2'; e.currentTarget.style.color = '#BE123C'; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#E11D48'; }}
        >
          <LogOut size={16} strokeWidth={2} />
          {!collapsed && 'Déconnexion'}
        </button>
      </div>
    </div>
  );
}
