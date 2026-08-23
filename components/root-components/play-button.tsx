"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";

export default function PlayButton() {
  return (
    <div className="flex-between gap-2 relative px-2 pr-3">
      <Button className="flex-10 h-10 rounded-sm shadow font-mono flex-cebnter gap-2 pl-1">
        <span className="text-xl font-extrabold">🔥Let's Go! Play</span>
      </Button>
      <Button className="flex-1 h-10 rounded-sm shadow" variant={"secondary"}>
        <SlidersHorizontal className="h-full" />
      </Button>
    </div>
  );
}
