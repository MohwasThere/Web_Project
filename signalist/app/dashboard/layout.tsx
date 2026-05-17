'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import testingLogo from '@/app/logo.svg';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Eye, 
  Zap, 
  User, 
  CreditCard, 
  Newspaper,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Market", href: "/dashboard/market", icon: BarChart3 },
  { name: "Watchlist", href: "/dashboard/watchlist", icon: Eye },
  { name: "AI Predictions", href: "/dashboard/predictions", icon: Zap },
  { name: "Portfolio", href: "/dashboard/portfolio", icon: BarChart3 },
  { name: "News", href: "/dashboard/news", icon: Newspaper },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://i.pravatar.cc/150?img=68');
  const [userName, setUserName] = useState('Profile');

  useEffect(() => {
    const loadAvatar = async () => {
      try {
        const res = await fetch('/api/auth/get-session', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = await res.json();
        if (payload?.user?.image) {
          setAvatarUrl(payload.user.image);
        }
        if (payload?.user?.name) {
          setUserName(payload.user.name);
        }
      } catch {}
    };
    void loadAvatar();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <div
        className="bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col fixed h-screen transition-all duration-300 ease-in-out z-30"
        style={{ width: collapsed ? '5rem' : '18rem' }}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-12">
          <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-10' : 'w-[100px]'}`}>
            <Image src={testingLogo} alt="Signalist Logo" width={100} height={100} className="rounded-lg object-contain" />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 transition-all ${
                  collapsed
                    ? item.name === 'Profile'
                      ? 'p-0.5 justify-center rounded-full w-[34px] h-[34px]'
                      : 'px-2.5 py-2.5 justify-center rounded-xl'
                    : 'px-4 py-2.5 rounded-lg'
                } ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {item.name === 'Profile' ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full object-cover flex-shrink-0 ring-1 ring-zinc-600"
                  />
                ) : (
                  <item.icon size={22} className="flex-shrink-0" />
                )}
                {!collapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.name === 'Profile' ? userName : item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-800 mt-auto">
          <button 
            onClick={() => window.location.href = '/'}
            title={collapsed ? 'Logout' : undefined}
            className={`flex items-center gap-3 text-red-400 hover:text-red-500 w-full rounded-lg hover:bg-zinc-900 ${
              collapsed ? 'px-3 py-3 justify-center' : 'px-5 py-3'
            }`}
          >
            <LogOut size={22} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? '5rem' : '18rem' }}
      >
        {children}
      </div>
    </div>
  );
}

