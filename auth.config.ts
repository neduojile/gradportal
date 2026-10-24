import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      const protectedRoutes = [
        "/dashboard",
        "/business",
        "/jobs",
        "/profile",
        "/applications",
        "/notifications",
        "/saved",
        "/settings",
        "/admin",
      ];

      const isProtectedRoute = protectedRoutes.some(
        (route) =>
          pathname === route || pathname.startsWith(`${route}/`),
      );

      if (isProtectedRoute && !auth?.user) {
        return false;
      }

      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;

