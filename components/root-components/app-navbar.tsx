"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Flame,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Card } from "@/components/ui/card";

import AnimatedLogo from "@/components/ui/animated-logo";
import { AnimatedThemeToggler } from "@/components/ui/magicui/animated-theme-toggler";
import { authClient } from "@/src/lib/auth-client";
import { AuroraText } from "../ui/aurora-text";
import { TypingAnimation } from "../ui/magicui/typewrite-hover";

type AppNavbarProps = {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

export default function AppNavbar({ user }: AppNavbarProps) {
  const router = useRouter();

  const initials = user.name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await authClient.signOut();

    router.push("/get-started");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 hidden w-full gap-2 p-2 sm:flex lg:px-10">
      {/* Logo */}

      <Card className="flex h-18 w-30 shrink-0 items-center justify-center p-0">
        <div className="scale-[0.8]">
          <AnimatedLogo />
        </div>
      </Card>

      {/* Main Navbar */}

      <div className="flex h-18 w-full items-center justify-between gap-2 rounded-2xl border bg-background/50 px-5 py-2 shadow backdrop-blur-xs">
        {/* Greeting */}

        <div>
          <p className="text-sm text-muted-foreground">Welcome back 🐥</p>

          <h3 className="text-base font-bold lg:text-2xl">
            <AuroraText>Ready</AuroraText> to play,{" "}
            <span className="font-mono text-3xl text-card font-extrabold text-shadow-xs bg-primary">
              {user.name.split(" ")[0]}
            </span>{" "}
            ?
          </h3>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-2">
          <AnimatedThemeToggler />

          <Button size="icon" variant="secondary">
            <Flame />
          </Button>

          {/* Profile Popover */}

          <Popover>
            <PopoverTrigger asChild>
              <Button size={"icon"}>
                <Avatar className="after:border-0">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />

                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                {/* <div className="hidden text-left lg:block">
                  <p className="max-w-32 truncate text-sm font-semibold">
                    {user.name}
                  </p>

                  <p className="max-w-32 truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div> */}
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="p-0 w-60">
              {/* User Information */}

              <div className="flex items-center gap-1 px-4 pt-4">
                <Avatar size="lg">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />

                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-xs">{user.name}</p>

                  <p className="truncate font-mono text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Navigation */}

              <div className="space-y-2 py-0 flex-center flex-col px-6">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/profile">
                    <UserRound className="mr-2 size-4" />
                    Profile
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 size-4" />
                    My Work
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/profile/settings">
                    <Settings className="mr-2 size-4" />
                    Settings
                  </Link>
                </Button>
              </div>

              {/* Logout */}

              <div className="border-t pt-4 pb-6 px-6  bg-accent dark:bg-transparent rounded-b-lg">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full flex-center font-mono text-base p-0 dark:hover:bg-primary"
                      data-hover-group="button-group"
                    >
                      <TypingAnimation
                        triggerOnHover={true}
                        resetOnHoverExit={true}
                        fallbackText="😔Log out"
                        words={["🥺I'm", "😔goin' to miss ya..."]}
                        loop={true}
                        hoverGroup="button-group"
                        disableOnMobile={true}
                        blinkCursor={true}
                      />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Log out of NoweLAX?</AlertDialogTitle>

                      <AlertDialogDescription>
                        Are you sure you want to log out? Your current progress
                        is saved, but you'll need to log in again to continue
                        where you left off.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="grid grid-cols-1 bg-accent dark:bg-transparent">
                      <AlertDialogCancel
                        data-hover-group="button-group"
                        className=""
                      >
                        <TypingAnimation
                          triggerOnHover={true}
                          resetOnHoverExit={true}
                          fallbackText="🥹Stay here"
                          words={["🥺Please", "😔baby...", "🥹Stay here"]}
                          loop={true}
                          hoverGroup="button-group"
                          disableOnMobile={true}
                          blinkCursor={true}
                        />
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleLogout}
                        data-hover-group="button-group"
                      >
                        <TypingAnimation
                          triggerOnHover={true}
                          resetOnHoverExit={true}
                          fallbackText="🫡Yes, log me out"
                          words={["👋bye", "👋farewell"]}
                          loop={true}
                          hoverGroup="button-group"
                          disableOnMobile={true}
                          blinkCursor={true}
                        />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  );
}
