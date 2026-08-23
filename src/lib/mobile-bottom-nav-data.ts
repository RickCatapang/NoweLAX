import {
  Flame,
  ChartNoAxesCombined,
  UserRound,
  LayoutGrid,
  BookmarkCheck,
} from "lucide-react";

export const navItems = [
  {
    href: "/",
    label: "Home",
    icon: LayoutGrid,
    activeClass: "bg-primary text-primary-foreground",
  },
  {
    href: "/recent",
    label: "Recent",
    icon: Flame,
    activeClass: "bg-chart-4",
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: BookmarkCheck,
    activeClass: "bg-chart-3",
  },
  {
    href: "/analytics",
    label: "Stats",
    icon: ChartNoAxesCombined,
    activeClass: "bg-accent mix-blend-multiply dark:mix-blend-normal",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
    activeClass: "bg-destructive",
  },
];
