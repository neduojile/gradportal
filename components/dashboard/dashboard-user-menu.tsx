"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import {
  ChevronDown,
  FileText,
  Heart,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardUserMenuProps {
  session: Session | null;
}

export default function DashboardUserMenu({
  session,
}: DashboardUserMenuProps) {
  const name = session?.user?.name ?? "Graduate";
  const email = session?.user?.email ?? "No email";

  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GR";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-auto rounded-2xl px-2 py-2"
          />
        }
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="hidden text-left lg:block">
            <p className="text-sm font-semibold">
              {name}
            </p>

            <p className="text-xs text-muted-foreground">
              Graduate
            </p>
          </div>

          <ChevronDown className="hidden size-4 text-muted-foreground lg:block" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl"
      >
        <div className="px-3 py-2">
          <p className="font-semibold">
            {name}
          </p>

          <p className="text-xs text-muted-foreground">
            {email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/profile" />}>
          <User className="mr-2 size-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/applications" />}>
          <FileText className="mr-2 size-4" />
          Applications
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/saved" />}>
          <Heart className="mr-2 size-4" />
          Saved Jobs
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="mr-2 size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-500">
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}