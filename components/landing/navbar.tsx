import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-500/20">
            <BriefcaseBusiness className="h-5 w-5 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-950">
              Employa
            </span>

            <span className="text-xs text-slate-500">
              Graduate Recruitment Platform
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {[
            ["Home", "/"],
            ["Jobs", "/jobs"],
            ["Features", "/features"],
            ["About", "/about"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="group relative text-sm font-medium text-slate-700"
            >
              {label}
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-orange-500" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link href="/register">
            <Button
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}




