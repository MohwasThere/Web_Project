'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, Award, Edit3, Lock, X } from 'lucide-react';
import { useSubscription } from '@/app/context/SubscriptionContext';
import { authClient } from '@/lib/auth-client';
import { normalizeTicker } from '@/lib/market/logos';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { currentPlan } = useSubscription();
  const [user, setUser] = useState({
    name: "",
    email: "",
    joinDate: "",
    avatar: "https://i.pravatar.cc/150?img=68",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");

  // Portfolio Stats (live from API + live quotes)
  const [portfolioStats, setPortfolioStats] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPL: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const loadSessionProfile = async () => {
      const response = await fetch('/api/auth/get-session', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      const sessionUser = payload?.user;
      if (!sessionUser) return;

      const joined = sessionUser.createdAt
        ? new Date(sessionUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';

      setUser((prev) => ({
        ...prev,
        name: sessionUser.name ?? prev.name,
        email: sessionUser.email ?? prev.email,
        joinDate: joined,
      }));
      setEditedName(sessionUser.name ?? '');
    };

    const loadPortfolioStats = async () => {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/portfolio', { cache: 'no-store' });
        if (!res.ok) return;
        const payload = (await res.json()) as {
          holdings: Array<{ symbol: string; shares: number; buyPrice: number; currentPrice: number }>;
        };
        const holdings = payload.holdings ?? [];
        if (holdings.length === 0) { setStatsLoading(false); return; }

        // Fetch live prices for all holdings
        const symbols = Array.from(new Set(holdings.map((h) => normalizeTicker(h.symbol))));
        const quotesRes = await fetch(
          `/api/market/quotes?symbols=${encodeURIComponent(symbols.join(','))}`,
          { cache: 'no-store' }
        );
        const quotesPayload = quotesRes.ok
          ? ((await quotesRes.json()) as { quotes: Record<string, { price: number }> })
          : { quotes: {} };

        const invested = holdings.reduce((sum, h) => sum + h.shares * h.buyPrice, 0);
        const current = holdings.reduce((sum, h) => {
          const livePrice = quotesPayload.quotes[normalizeTicker(h.symbol)]?.price ?? h.currentPrice;
          return sum + h.shares * livePrice;
        }, 0);

        setPortfolioStats({ totalInvested: invested, currentValue: current, totalPL: current - invested });
      } finally {
        setStatsLoading(false);
      }
    };

    void Promise.all([loadSessionProfile(), loadPortfolioStats()]);
  }, []);

  const handleSave = () => {
    setUser({ ...user, name: editedName });
    setIsEditing(false);
    toast.success('Name updated!');
  };

  const handleChangePassword = async () => {
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.next.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await authClient.changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.next,
        revokeOtherSessions: false,
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setPasswordForm({ current: '', next: '', confirm: '' });
    } catch {
      toast.error('Incorrect current password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-10">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-lg object-cover border-4 border-zinc-700"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-zinc-800 border border-zinc-600 text-3xl font-bold px-4 py-2 rounded-lg focus:outline-none"
                  />
                ) : (
                  <h2 className="text-4xl font-bold">{user.name || '—'}</h2>
                )}
                <button onClick={() => setIsEditing(!isEditing)} className="text-zinc-400 hover:text-white">
                  <Edit3 size={22} />
                </button>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                <Mail size={18} />
                <span>{user.email || '—'}</span>
              </div>

              {user.joinDate && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-zinc-400 mt-1">
                  <Calendar size={18} />
                  <span>Joined {user.joinDate}</span>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-lg">
                <Award size={24} />
                <span className="font-semibold">{currentPlan} Member</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 rounded-lg"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Stats Cards — live portfolio data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <p className="text-zinc-400">Total Invested</p>
            <p className="text-4xl font-bold mt-3">
              {statsLoading ? <span className="text-zinc-600 text-2xl">Loading…</span> : `$${portfolioStats.totalInvested.toFixed(2)}`}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <p className="text-zinc-400">Current Portfolio Value</p>
            <p className="text-4xl font-bold mt-3">
              {statsLoading ? <span className="text-zinc-600 text-2xl">Loading…</span> : `$${portfolioStats.currentValue.toFixed(2)}`}
            </p>
          </div>

          <div className={`bg-zinc-900 border border-zinc-800 rounded-xl p-8 ${portfolioStats.totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <p className="text-zinc-400">Total P/L</p>
            <p className="text-4xl font-bold mt-3">
              {statsLoading
                ? <span className="text-zinc-600 text-2xl">Loading…</span>
                : `${portfolioStats.totalPL >= 0 ? '+' : ''}$${portfolioStats.totalPL.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
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
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-blue-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="pt-6">
              <button className="text-red-500 hover:text-red-400 font-medium">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Lock size={22} className="text-blue-400" />
                <h2 className="text-xl font-bold">Change Password</h2>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-zinc-400 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => void handleChangePassword()}
              disabled={passwordLoading || !passwordForm.current || !passwordForm.next || !passwordForm.confirm}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-lg font-semibold"
            >
              {passwordLoading ? 'Saving…' : 'Update Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
