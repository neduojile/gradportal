"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";

import { loginSchema, type LoginSchema } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema) => {
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      const session = await getSession();

      if (!session?.user) {
        toast.error("We could not establish your session. Please try again.");
        return;
      }

      toast.success("Welcome back!");

      if (session.user.role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }

      router.refresh();
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.10)] lg:min-h-[680px] lg:grid-cols-2">

          {/* Brand panel */}

          <div className="relative hidden overflow-hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-orange-600/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-black shadow-lg shadow-orange-500/20">
                  E
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-tight">
                    Employa
                  </h2>

                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Graduate Recruitment
                  </p>
                </div>
              </div>
            </div>

            <div className="relative max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-300">
                <BriefcaseBusiness className="size-3.5" />
                Welcome back
              </span>

              <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight xl:text-6xl">
                Your career.
                <span className="block text-orange-500">
                  Your next move.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                Sign in to your Employa account and continue discovering
                verified graduate opportunities built around your career goals.
              </p>

              <div className="mt-6 space-y-3">
                <Benefit text="Discover verified graduate opportunities" />
                <Benefit text="Track every application in one place" />
                <Benefit text="Keep your professional profile up to date" />
              </div>
            </div>

            <p className="relative text-xs text-slate-500">
              Copyright 2026 Employa. Graduate Recruitment Platform.
            </p>
          </div>

          {/* Form panel */}

          <div className="flex items-center justify-center px-5 py-8 sm:px-10 md:px-12 lg:px-12 xl:px-14">
            <div className="w-full max-w-md">

              {/* Mobile brand */}

              <div className="mb-6 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 font-black text-white shadow-lg shadow-orange-500/20">
                    E
                  </div>

                  <div>
                    <h2 className="font-bold tracking-tight">
                      Employa
                    </h2>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      Graduate Recruitment
                    </p>
                  </div>
                </div>
              </div>

              <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-orange-600">
                Welcome Back
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                Welcome back.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Sign in to continue your graduate career journey.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <FormField
                  label="Email Address"
                  error={errors.email?.message}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 px-4 focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </FormField>

                <FormField
                  label="Password"
                  error={errors.password?.message}
                >
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password")}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 px-4 focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </FormField>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="h-12 w-full rounded-2xl bg-orange-500 font-bold text-white shadow-lg shadow-orange-500/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Do not have an account?</span>

                <Link
                  href="/register"
                  className="font-bold text-orange-600"
                >
                  Create Account
                </Link>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-500" />

                <p className="text-xs leading-5 text-slate-500">
                  Sign in to manage your applications, saved jobs,
                  notifications, and professional profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Benefit({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <div className="flex size-6 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
        <CheckCircle2 className="size-3.5" />
      </div>

      <span>{text}</span>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      {children}

      {error ? (
        <p className="mt-2 text-xs font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}

