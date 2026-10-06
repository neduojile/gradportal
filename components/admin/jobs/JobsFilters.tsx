"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JobsFilters() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/[0.03] via-transparent to-blue-500/[0.03]" />

      <div className="relative flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Search */}
        <div className="relative w-full xl:max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search jobs, company, category..."
            className="h-12 rounded-2xl border-slate-200 pl-12 shadow-none focus-visible:ring-2 focus-visible:ring-orange-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-orange-500">
            <option>All Status</option>
            <option>Open</option>
            <option>Closed</option>
          </select>

          <select className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-orange-500">
            <option>All Categories</option>
            <option>Software</option>
            <option>Design</option>
            <option>Marketing</option>
            <option>Finance</option>
          </select>

          <select className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-orange-500">
            <option>Employment Type</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Remote</option>
            <option>Internship</option>
          </select>

          <Button
            variant="outline"
            className="h-12 rounded-2xl"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            More
          </Button>

          <Button
            variant="ghost"
            className="h-12 rounded-2xl text-red-500 hover:text-red-600"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
}