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
import { toast } from "sonner";

import { registerUser } from "@/lib/actions/register";
import {
  registerSchema,
  type RegisterSchema,
} from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchema) => {
    startTransition(async () => {
      const result = await registerUser(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      reset();

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    });
  };

  return (
    <main className="min-h-screen bg-[#fffaf5] text-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-6 sm:px-6 sm:py-6">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-orange-100 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.10)] lg:min-h-[680px] lg:grid-cols-2">

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
                Start your journey
              </span>

              <h1 className="mt-5 text-5xl font-black leading-[1.02] tracking-tight xl:text-6xl">
                Build your
                <span className="block text-orange-500">
                  next chapter.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
                Create your Employa account, build your graduate profile, and
                discover verified opportunities designed to move your career
                forward.
              </p>

              <div className="mt-6 space-y-3">
                <Benefit text="Discover verified graduate opportunities" />
                <Benefit text="Track every application in one place" />
                <Benefit text="Build a stronger professional profile" />
              </div>
            </div>

            <p className="relative text-xs text-slate-500">
              Copyright 2026 Employa. Graduate Recruitment Platform.
            </p>
          </div>

          <div className="flex items-center justify-center px-5 py-7 sm:px-10 md:px-12 lg:px-12 xl:px-14">
            <div className="w-full max-w-md">

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
                Create Account
              </div>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950">
                Start with Employa.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your account and take the first step toward your next
                graduate opportunity.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <FormField
                  label="Full Name"
                  error={errors.name?.message}
                >
                  <Input
                    placeholder="Enter your full name"
                    {...register("name")}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 px-4 focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </FormField>

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
                    placeholder="Create a password"
                    {...register("password")}
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50/70 px-4 focus:border-orange-400 focus:ring-orange-400/20"
                  />
                </FormField>

                <FormField
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                >
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...register("confirmPassword")}
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
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-500">
                <span>Already have an account?</span>

                <Link
                  href="/login"
                  className="font-bold text-orange-600"
                >
                  Sign In
                </Link>
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-orange-500" />

                <p className="text-xs leading-5 text-slate-500">
                  Your account gives you access to graduate opportunities,
                  applications, saved jobs, notifications, and your
                  professional profile.
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


