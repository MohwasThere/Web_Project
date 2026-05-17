'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Eye, 
  Zap, 
  User, 
  CreditCard, 
  Newspaper,
  LogOut 
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

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-zinc-950 border-r border-zinc-800 p-6 flex flex-col fixed h-screen">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold">Signalist</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                <item.icon size={22} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-zinc-800 mt-auto">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-3 px-5 py-3 text-red-400 hover:text-red-500 w-full rounded-2xl hover:bg-zinc-900"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-72">
        {children}
      </div>
    </div>
  );
}
