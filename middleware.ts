import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req;

  const isLoggedIn = !!session;
  const role = session?.user?.role;
  const pathname = nextUrl.pathname;

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

  // Public auth pages are available when logged out.
  // Logged-in users are redirected to their correct workspace.
  if (isLoggedIn && isAuthPage) {
    if (role === "ADMIN") {
      return Response.redirect(new URL("/admin", req.url));
    }

    return Response.redirect(new URL("/dashboard", req.url));
  }

  // Protect graduate routes.
  if (isGraduateRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.url));
    }

    // ADMIN users must never enter the graduate workspace.
    if (role === "ADMIN") {
      return Response.redirect(new URL("/admin", req.url));
    }

    return;
  }

  // Protect admin routes.
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.url));
    }

    // GRADUATE users must never enter the admin workspace.
    if (role !== "ADMIN") {
      return Response.redirect(new URL("/dashboard", req.url));
    }

    return;
  }

  return;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
