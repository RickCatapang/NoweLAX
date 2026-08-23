"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { navItems } from "@/src/lib/mobile-bottom-nav-data";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "flex-between w-full gap-3", // preserves horizontal layout
        !mounted && "pointer-events-none select-none",
      )}
    >
      {navItems.map(({ href, label, icon: Icon, activeClass }) => {
        const isActive = mounted
          ? pathname === href || (pathname.startsWith(href) && href !== "/")
          : false;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-center flex-col text-xs transition-colors rounded-full aspect-square w-12",
              isActive
                ? `shadow w-11 text-shadow-xs  ${activeClass}`
                : "text-foreground",
            )}
          >
            <Icon />
            {!isActive && label}
          </Link>
        );
      })}
    </div>
  );
}
