"use client";
import Header from "../../components/header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen text-gray-400">
      <Header />
      <div className="container py-8 md:py-10">{children}</div>
    </main>
  );
};

export default layout;

