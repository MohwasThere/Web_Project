'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Award, Edit3 } from 'lucide-react';
import { useSubscription } from '@/app/context/SubscriptionContext';

export default function ProfilePage() {
  const { currentPlan } = useSubscription();
  const [user, setUser] = useState({
    name: "Mazen Wael",
    email: "mazen@example.com",
    joinDate: "March 2025",
    avatar: "https://i.pravatar.cc/150?img=68",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);

  // Portfolio Stats (from API)
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPL: 0,
  });

  useEffect(() => {
    const loadSessionProfile = async () => {
      const response = await fetch('/api/auth/get-session', { cache: 'no-store' });
      if (!response.ok) return;

      const payload = await response.json();
      const sessionUser = payload?.user;
      if (!sessionUser) return;

      setUser((prev) => ({
        ...prev,
        name: sessionUser.name ?? prev.name,
        email: sessionUser.email ?? prev.email,
      }));
      setEditedName((prev) => sessionUser.name ?? prev);
    };

    const loadPortfolioStats = async () => {
      const response = await fetch('/api/portfolio', { cache: 'no-store' });
      if (!response.ok) return;

      const payload = (await response.json()) as {
        holdings: Array<{ shares: number; buyPrice: number; currentPrice: number }>;
      };

      const holdings = payload.holdings ?? [];
      const invested = holdings.reduce((sum, h) => sum + h.shares * h.buyPrice, 0);
      const current = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);

      setPortfolioStats({
        totalInvested: invested,
        currentValue: current,
        totalPL: current - invested,
      });
    };

    void Promise.all([loadSessionProfile(), loadPortfolioStats()]);
  }, []);

  const handleSave = () => {
    setUser({ ...user, name: editedName });
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-2xl object-cover border-4 border-zinc-700"
              />
              <button className="absolute bottom-2 right-2 bg-zinc-800 p-2 rounded-full hover:bg-zinc-700">
                <Edit3 size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-zinc-800 border border-zinc-600 text-3xl font-bold px-4 py-2 rounded-2xl focus:outline-none"
                  />
                ) : (
                  <h2 className="text-4xl font-bold">{user.name}</h2>
                )}
                <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-400 hover:text-white">
                  <Edit3 size={22} />
                </button>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                <Mail size={18} />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mt-1">
                <Calendar size={18} />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl">
                <Award size={24} />
                <span className="font-semibold">{currentPlan} Member</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-2xl"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400">Total Invested</p>
            <p className="text-4xl font-bold mt-3">${portfolioStats.totalInvested.toFixed(2)}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400">Current Portfolio Value</p>
            <p className="text-4xl font-bold mt-3">${portfolioStats.currentValue.toFixed(2)}</p>
          </div>

          <div className={`bg-zinc-900 border border-zinc-800 rounded-3xl p-8 ${portfolioStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <p className="text-zinc-400">Total P/L</p>
            <p className="text-4xl font-bold mt-3">
              ${portfolioStats.totalPL.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <h3 className="text-2xl font-semibold mb-6">Account Settings</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-zinc-800">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-zinc-500">Receive price alerts and market updates</p>
              </div>
              <div className="bg-emerald-600 px-4 py-2 rounded-xl text-sm">Enabled</div>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-zinc-800">
              <div>
                <p className="font-medium">Subscription</p>
                <p className="text-sm text-zinc-500">Current: <span className="text-emerald-400">{currentPlan}</span></p>
              </div>
              <button 
                onClick={() => window.location.href = '/dashboard/subscription'}
                className="text-blue-400 hover:underline"
              >
                Change Plan →
              </button>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-zinc-800">
              <div>
                <p className="font-medium">Security</p>
                <p className="text-sm text-zinc-500">Password & Two-Factor Authentication</p>
              </div>
              <button className="text-blue-400 hover:underline">Manage</button>
            </div>

            <div className="pt-6">
              <button className="text-red-500 hover:text-red-400 font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
