import Link from "next/link";
import Image from "next/image";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout">
      {/* ── Left panel (form) ── */}
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist logo"
            width={140}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex-1 flex flex-col justify-center pb-8 lg:pb-12">
          {children}
        </div>
      </section>

      {/* ── Right panel (decorative) ── */}
      <section className="auth-right-section">
        {/* Dashboard screenshot fills the top portion */}
        <div className="flex-1 relative overflow-hidden rounded-xl mb-8 min-h-0">
          <Image
            src="/assets/images/dashboard.png"
            alt="Dashboard Preview"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Fade out at the bottom so it flows into the testimonial */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-800 to-transparent" />
        </div>

        {/* Testimonial pinned to bottom */}
        <div className="relative z-10 shrink-0">
          <blockquote className="auth-blockquote">
            "Signalist turned my watchlist into a winning list. The alerts are
            spot-on, and I feel more confident making moves in the market."
          </blockquote>
          <div className="flex items-center justify-between mt-4">
            <div>
              <cite className="auth-testimonial-author">Ethan R.</cite>
              <p className="text-xs text-gray-500 mt-0.5 not-italic">
                Retail Investor
              </p>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt=""
                  key={star}
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default layout;
