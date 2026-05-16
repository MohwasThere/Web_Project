// app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success("Account created successfully! Welcome to Signalist 🎉");
      window.location.href = '/dashboard';
    }, 1000);
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
          <h1 className="text-4xl font-bold">Create Account</h1>
          <p className="text-zinc-400 mt-2">Join thousands of smart investors</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="Mazen Wael"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-zinc-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-2xl font-semibold text-lg hover:bg-gray-200 transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight />
            </button>
          </form>

          <p className="text-center text-zinc-500 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-8">
          By signing up, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}