// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import testingLogo from '@/app/logo.svg';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getLoginErrorMessage = (rawMessage?: string) => {
    const message = (rawMessage ?? '').toLowerCase();

    if (
      message.includes('invalid') ||
      message.includes('credentials') ||
      message.includes('password') ||
      message.includes('user not found')
    ) {
      return 'Incorrect email or password.';
    }

    return rawMessage ?? 'Unable to sign in. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

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
        const message = getLoginErrorMessage(payload?.message);
        throw new Error(message);
      }

      const payload = await response.json().catch(() => null);
      if (!payload?.user) {
        throw new Error('Incorrect email or password.');
      }

      toast.success('Welcome back to Signalist!');
      router.push('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      setFormError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Image src={testingLogo} alt="Signalist Logo" width={100} height={100} className="rounded-lg object-contain" />
          </div>
          <h1 className="text-4xl font-bold text-white">Welcome Back</h1>
          <p className="text-zinc-400 mt-2">Sign in to continue your journey</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormError(null);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
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
                  onChange={(e) => {
                    setFormError(null);
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-lg font-semibold text-lg hover:bg-gray-200 transition flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </button>

            {formError && (
              <p className="text-sm text-red-400 text-center">{formError}</p>
            )}
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
