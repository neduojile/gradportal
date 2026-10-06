import Container from "@/components/design/Container";
import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Jobs", href: "/jobs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const companyLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Help Center", href: "/help" },
  { name: "FAQs", href: "/faq" },
];

const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com",
    label: "X",
  },
  {
    icon: FaInstagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: FaLinkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: FaGithub,
    href: "https://github.com",
    label: "GitHub",
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 text-slate-300">
      <Container className="py-20">
        <div className="grid gap-14 lg:grid-cols-4">
          {/* Brand */}

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Employa
                </h2>

                <p className="text-sm text-slate-400">
                  Graduate Recruitment Platform
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-md leading-7 text-slate-400">
              Employa helps graduates connect with trusted employers,
              discover career opportunities, and manage applications through
              one modern recruitment platform.
            </p>

            <div className="mt-8 flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}

          <div>
            <h3 className="text-lg font-semibold text-white">
              Support
            </h3>

            <ul className="mt-6 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row">
          <p>
            Ã‚Â© {new Date().getFullYear()} Employa. All rights reserved.
          </p>

          <p>
            Designed &amp; Developed with Ã¢ÂÂ¤Ã¯Â¸Â using Next.js, Prisma &amp;
            PostgreSQL.
          </p>
        </div>
      </Container>
    </footer>
  );
}

