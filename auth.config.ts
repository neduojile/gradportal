import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const pathname = request.nextUrl.pathname;

      const isAuthPage =
        pathname === "/login" ||
        pathname === "/register";

      const isGraduateRoute =
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/jobs" ||
        pathname.startsWith("/jobs/") ||
        pathname === "/profile" ||
        pathname.startsWith("/profile/") ||
        pathname === "/applications" ||
        pathname.startsWith("/applications/") ||
        pathname === "/notifications" ||
        pathname.startsWith("/notifications/") ||
        pathname === "/saved" ||
        pathname.startsWith("/saved/") ||
        pathname === "/settings" ||
        pathname.startsWith("/settings/");

      const isAdminRoute =
        pathname === "/admin" ||
        pathname.startsWith("/admin/");

      if (isLoggedIn && isAuthPage) {
        return Response.redirect(
          new URL(
            role === "ADMIN" ? "/admin" : "/dashboard",
            request.url,
          ),
        );
      }

      if (isGraduateRoute) {
        if (!isLoggedIn) return false;
        if (role === "ADMIN") {
          return Response.redirect(new URL("/admin", request.url));
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (role !== "ADMIN") {
          return Response.redirect(new URL("/dashboard", request.url));
        }
        return true;
      }

      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
