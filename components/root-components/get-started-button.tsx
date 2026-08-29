"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function GetStartedButton() {
  const pathname = usePathname();

  // Hide on get-started page
  if (
    pathname === "/get-started" ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <Button asChild>
      <a href="/get-started">
        Get Started
        <ArrowRight />
      </a>
    </Button>
  );
}
