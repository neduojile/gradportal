import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-white/40
        bg-white/70
        backdrop-blur-xl
        shadow-xl
        shadow-slate-200/40
        ${className}
      `}
    >
      {children}
    </div>
  );
}