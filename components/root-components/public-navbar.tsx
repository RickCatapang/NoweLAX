import { MobileBottomNav } from "./mobile-nav-link";

import { Button } from "../ui/button";
import { Flame } from "lucide-react";
import { Card } from "../ui/card";
import AnimatedLogo from "../ui/animated-logo";
import { AuroraText } from "../ui/aurora-text";
import { AnimatedThemeToggler } from "../ui/magicui/animated-theme-toggler";
import { GetStartedButton } from "./get-started-button";

export default function RootNavbar() {
  return (
    <>
      {/* Mobile bottom navigation */}
      <nav className="w-full fixed bottom-0 pb-3 min-h-14 sm:hidden flex justify-center items-center z-10">
        <div className="bg-background flex-between shadow shadow-blur rounded-full border w-fit py-1 px-2">
          <MobileBottomNav />
        </div>
      </nav>

      {/* Desktop public navbar */}
      <nav className="w-full fixed top-0 p-2 lg:px-10 px-1 sm:flex hidden justify-between items-start z-10 gap-2">
        {/* Logo */}
        <div className="flex items-baseline-last flex-col">
          <Card className="p-0 w-30 flex-center h-18">
            <div className="scale-[0.8]">
              <AnimatedLogo />
            </div>
          </Card>
        </div>

        {/* Main navbar */}
        <div className="bg-background/50 backdrop-blur-xs h-18 flex-between shadow shadow-blur rounded-2xl border w-full px-5 py-2 gap-2">
          {/* Greeting */}
          <div>
            <h3 className="lg:text-2xl text-lg font-bold">
              Good <AuroraText>Day!</AuroraText> 🐥
            </h3>
          </div>

          {/* Actions */}
          <div className="flex-between gap-2">
            <AnimatedThemeToggler />

            {/* Future: paused assessment notifications */}
            <Button size="icon" variant="secondary">
              <Flame />
            </Button>

            {/* Public action */}
            <GetStartedButton />
          </div>
        </div>
      </nav>
    </>
  );
}
