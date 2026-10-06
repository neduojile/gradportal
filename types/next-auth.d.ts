import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "GRADUATE";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "ADMIN" | "GRADUATE";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "GRADUATE";
  }
}