"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerPortal,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
};

// --- Context ---
interface ResponsiveOverlayContextValue {
  isMobile: boolean;
}
const ResponsiveOverlayContext = React.createContext<
  ResponsiveOverlayContextValue | undefined
>(undefined);

// --- Wrapper ---
interface ResponsiveOverlayProps {
  children: React.ReactNode;
  breakpoint?: number;
}
export const ResponsiveOverlay: React.FC<ResponsiveOverlayProps> & {
  Trigger: typeof ResponsiveOverlayTrigger;
  Content: typeof ResponsiveOverlayContent;
} = ({ children, breakpoint = 768 }) => {
  const isMobile = useIsMobile(breakpoint);

  return (
    <ResponsiveOverlayContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer>{children}</Drawer>
      ) : (
        <PopoverPrimitive.Root>{children}</PopoverPrimitive.Root>
      )}
    </ResponsiveOverlayContext.Provider>
  );
};

// --- Trigger ---
interface ResponsiveOverlayTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
const ResponsiveOverlayTrigger = React.forwardRef<
  HTMLButtonElement,
  ResponsiveOverlayTriggerProps
>(({ children, ...props }, ref) => {
  const context = React.useContext(ResponsiveOverlayContext);
  if (!context)
    throw new Error(
      "ResponsiveOverlay.Trigger must be inside ResponsiveOverlay"
    );

  return context.isMobile ? (
    <DrawerTrigger asChild ref={ref} {...props}>
      {children}
    </DrawerTrigger>
  ) : (
    <PopoverPrimitive.Trigger asChild ref={ref} {...props}>
      {children}
    </PopoverPrimitive.Trigger>
  );
});

// --- Content ---
type ResponsiveOverlayContentProps = {
  children: React.ReactNode;
  className?: string;
  title?: string; // optional title for Drawer accessibility
} & Partial<PopoverPrimitive.PopoverContentProps> &
  Partial<React.ComponentProps<typeof DrawerContent>>;

const ResponsiveOverlayContent = React.forwardRef<
  HTMLDivElement,
  ResponsiveOverlayContentProps
>(({ children, className, title = "Overlay", ...props }, ref) => {
  const context = React.useContext(ResponsiveOverlayContext);
  if (!context)
    throw new Error(
      "ResponsiveOverlay.Content must be inside ResponsiveOverlay"
    );

  if (context.isMobile) {
    const drawerProps = props as React.ComponentProps<typeof DrawerContent>;
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent
          ref={ref}
          className={cn(
            "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
            "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
            "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
            "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
            "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
            className
          )}
          {...drawerProps}
        >
          {/* Automatic hidden title for accessibility */}
          <VisuallyHidden>
            <DrawerTitle>{title}</DrawerTitle>
          </VisuallyHidden>
          {children}
        </DrawerContent>
      </DrawerPortal>
    );
  }

  const popoverProps = props as PopoverPrimitive.PopoverContentProps;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        sideOffset={6}
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-10 data-[state=open]:zoom-in-10 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        )}
        {...popoverProps}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});

ResponsiveOverlay.Trigger = ResponsiveOverlayTrigger;
ResponsiveOverlay.Content = ResponsiveOverlayContent;
