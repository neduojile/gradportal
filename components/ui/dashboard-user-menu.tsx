"use client";

import { BriefcaseBusiness, ChevronDown, LogOut, Settings, User } from "lucide-react";

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

export default function DashboardUserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="h-auto rounded-2xl px-2 py-2"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-orange-500 font-semibold text-white">
                CN
              </AvatarFallback>
            </Avatar>

            <div className="hidden text-left lg:block">
              <p className="font-semibold leading-none">
                Chinex
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Graduate
              </p>
            </div>

            <ChevronDown className="hidden size-4 text-muted-foreground lg:block" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl"
      >
        <div className="px-3 py-2">
          <p className="font-semibold">
            Chinex
          </p>

          <p className="text-sm text-muted-foreground">
            graduate@example.com
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem>
          <BriefcaseBusiness className="size-4" />
          Applications
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive">
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}