// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message = payload?.message ?? 'Invalid email or password';
        throw new Error(message);
      }

      const payload = await response.json().catch(() => null);
      if (!payload?.user) {
        throw new Error('Login failed. Please verify email and password.');
      }

      toast.success('Welcome back to Signalist!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center">
              <span className="text-4xl font-bold">S</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">Sign in to continue your journey</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-cyan-400 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
