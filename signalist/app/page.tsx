// app/page.tsx
import Link from 'next/link';
import testingLogo from '@/app/testing.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
            <span className="font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Signalist</h1>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
          <Link href="/auth/login" className="hover:text-cyan-400 transition">Login</Link>
          <Link 
            href="/auth/signup" 
            className="bg-white text-black px-8 py-3 rounded-2xl font-semibold hover:bg-gray-200 transition"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Smart Trading.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Simplified.
          </span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Real-time market data, powerful AI predictions, and a realistic portfolio simulator — 
            all in one beautiful platform.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link 
              href="/auth/signup"
              className="bg-white text-black px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Investing Now
            </Link>
            <Link 
              href="/dashboard"
              className="border border-zinc-700 hover:border-white px-10 py-4 rounded-2xl text-lg font-medium transition"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Features Teaser */}
      <div className="py-20 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-2xl font-semibold mb-2">Live Market Data</h3>
            <p className="text-zinc-400">Real-time charts and stock prices powered by TradingView</p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-semibold mb-2">AI Predictions</h3>
            <p className="text-zinc-400">Smart signals with confidence levels and funny roasts</p>
          </div>
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-semibold mb-2">Portfolio Simulator</h3>
            <p className="text-zinc-400">Practice trading with live price movements</p>
          </div>
        </div>
      </div>
    </div>
  );
}
