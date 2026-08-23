// "use client";

// import {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type ComponentType,
//   type RefAttributes,
//   type RefObject,
// } from "react";
// import {
//   motion,
//   useInView,
//   type DOMMotionComponents,
//   type HTMLMotionProps,
//   type MotionProps,
// } from "motion/react";

// import { cn } from "@/lib/utils";

// const motionElements = {
//   article: motion.article,
//   div: motion.div,
//   h1: motion.h1,
//   h2: motion.h2,
//   h3: motion.h3,
//   h4: motion.h4,
//   h5: motion.h5,
//   h6: motion.h6,
//   li: motion.li,
//   p: motion.p,
//   section: motion.section,
//   span: motion.span,
// } as const;

// type MotionElementType = Extract<
//   keyof DOMMotionComponents,
//   keyof typeof motionElements
// >;
// type TypingAnimationMotionComponent = ComponentType<
//   Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
// >;

// interface TypingAnimationProps extends Omit<MotionProps, "children"> {
//   children?: string;
//   words?: string[];
//   className?: string;
//   duration?: number;
//   typeSpeed?: number;
//   deleteSpeed?: number;
//   delay?: number;
//   pauseDelay?: number;
//   loop?: boolean;
//   as?: MotionElementType;
//   startOnView?: boolean;
//   showCursor?: boolean;
//   blinkCursor?: boolean;
//   cursorStyle?: "line" | "block" | "underscore";
//   triggerOnHover?: boolean;
//   fallbackText?: string;
//   resetOnHoverExit?: boolean;
//   hoverGroup?: string;
// }

// export function TypingAnimation({
//   children,
//   words,
//   className,
//   duration = 100,
//   typeSpeed,
//   deleteSpeed,
//   delay = 0,
//   pauseDelay = 300,
//   loop = false,
//   as: Component = "span",
//   startOnView = true,
//   showCursor = true,
//   blinkCursor = true,
//   cursorStyle = "block",
//   triggerOnHover = false,
//   fallbackText = "",
//   resetOnHoverExit = false,
//   hoverGroup,
//   ...props
// }: TypingAnimationProps) {
//   const MotionComponent = motionElements[
//     Component
//   ] as TypingAnimationMotionComponent;

//   const [displayedText, setDisplayedText] = useState<string>("");
//   const [currentWordIndex, setCurrentWordIndex] = useState(0);
//   const [currentCharIndex, setCurrentCharIndex] = useState(0);
//   const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
//   const [isHovered, setIsHovered] = useState(false);
//   const [hasStarted, setHasStarted] = useState(false);
//   const [isGroupHovered, setIsGroupHovered] = useState(false);
//   const elementRef = useRef<HTMLElement | null>(null);
//   const isInView = useInView(elementRef as RefObject<Element>, {
//     amount: 0.3,
//     once: true,
//   });

//   const wordsToAnimate = useMemo(
//     () => words ?? (children ? [children] : []),
//     [words, children],
//   );
//   const hasMultipleWords = wordsToAnimate.length > 1;

//   const typingSpeed = typeSpeed ?? duration;
//   const deletingSpeed = deleteSpeed ?? typingSpeed / 2;

//   // Determine if animation should start
//   const shouldStart = triggerOnHover
//     ? isHovered || isGroupHovered
//     : startOnView
//       ? isInView
//       : true;

//   // Check if should show fallback
//   const shouldShowFallback = triggerOnHover && !shouldStart && fallbackText;

//   const animationSourceKey = useMemo(
//     () => (words ? words.join("\u0000") : (children ?? "")),
//     [words, children],
//   );

//   // Reset animation when hover ends (if enabled)
//   useEffect(() => {
//     if (triggerOnHover && resetOnHoverExit && !shouldStart && hasStarted) {
//       setDisplayedText("");
//       setCurrentWordIndex(0);
//       setCurrentCharIndex(0);
//       setPhase("typing");
//       setHasStarted(false);
//     }
//   }, [shouldStart, triggerOnHover, resetOnHoverExit, hasStarted]);

//   // Reset animation when source changes
//   useEffect(() => {
//     setDisplayedText("");
//     setCurrentWordIndex(0);
//     setCurrentCharIndex(0);
//     setPhase("typing");
//     setHasStarted(false);
//   }, [animationSourceKey]);

//   // Main animation logic
//   useEffect(() => {
//     let timeout: ReturnType<typeof setTimeout> | null = null;

//     if (shouldStart && wordsToAnimate.length > 0) {
//       if (!hasStarted) setHasStarted(true);

//       const currentWord = wordsToAnimate[currentWordIndex] || "";
//       const graphemes = Array.from(currentWord);

//       const timeoutDelay =
//         delay > 0 && displayedText === "" && currentCharIndex === 0
//           ? delay
//           : phase === "typing"
//             ? typingSpeed
//             : phase === "deleting"
//               ? deletingSpeed
//               : pauseDelay;

//       timeout = setTimeout(() => {
//         const currentWord = wordsToAnimate[currentWordIndex] || "";
//         const graphemes = Array.from(currentWord);

//         switch (phase) {
//           case "typing":
//             if (currentCharIndex < graphemes.length) {
//               setDisplayedText(
//                 graphemes.slice(0, currentCharIndex + 1).join(""),
//               );
//               setCurrentCharIndex(currentCharIndex + 1);
//             } else {
//               if (hasMultipleWords || loop) {
//                 const isLastWord =
//                   currentWordIndex === wordsToAnimate.length - 1;
//                 if (!isLastWord || loop) {
//                   setPhase("pause");
//                 }
//               }
//             }
//             break;

//           case "pause":
//             setPhase("deleting");
//             break;

//           case "deleting":
//             if (currentCharIndex > 0) {
//               setDisplayedText(
//                 graphemes.slice(0, currentCharIndex - 1).join(""),
//               );
//               setCurrentCharIndex(currentCharIndex - 1);
//             } else {
//               const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length;
//               setCurrentWordIndex(nextIndex);
//               setPhase("typing");
//             }
//             break;
//         }
//       }, timeoutDelay);
//     }

//     return () => {
//       if (timeout !== null) {
//         clearTimeout(timeout);
//       }
//     };
//   }, [
//     shouldStart,
//     phase,
//     currentCharIndex,
//     currentWordIndex,
//     displayedText,
//     wordsToAnimate,
//     hasMultipleWords,
//     loop,
//     typingSpeed,
//     deletingSpeed,
//     pauseDelay,
//     delay,
//     hasStarted,
//   ]);

//   const currentWordGraphemes = Array.from(
//     wordsToAnimate[currentWordIndex] || "",
//   );
//   const isComplete =
//     !loop &&
//     currentWordIndex === wordsToAnimate.length - 1 &&
//     currentCharIndex >= currentWordGraphemes.length &&
//     phase !== "deleting";

//   // ONLY show cursor when actively typing or deleting
//   // And NOT showing fallback text
//   const shouldShowCursor =
//     showCursor &&
//     shouldStart &&
//     !shouldShowFallback &&
//     (phase === "typing" || phase === "deleting") &&
//     !isComplete;

//   const getCursorChar = () => {
//     switch (cursorStyle) {
//       case "block":
//         return "▌";
//       case "underscore":
//         return "_";
//       case "line":
//       default:
//         return "|";
//     }
//   };

//   const getDisplayText = () => {
//     if (shouldShowFallback) {
//       return fallbackText;
//     }
//     return displayedText;
//   };

//   const textToShow = getDisplayText();

//   // Handle hover events
//   const handleMouseEnter = () => {
//     if (triggerOnHover) {
//       setIsHovered(true);
//     }
//   };

//   const handleMouseLeave = () => {
//     if (triggerOnHover) {
//       setIsHovered(false);
//     }
//   };

//   // Group hover support
//   useEffect(() => {
//     if (!hoverGroup || !triggerOnHover || !elementRef.current) return;

//     const element = elementRef.current;
//     const parent = element.closest(
//       `[data-hover-group="${hoverGroup}"]`,
//     ) as HTMLElement;

//     if (!parent) return;

//     const handleParentMouseEnter = () => {
//       setIsGroupHovered(true);
//     };

//     const handleParentMouseLeave = () => {
//       setIsGroupHovered(false);
//     };

//     parent.addEventListener("mouseenter", handleParentMouseEnter);
//     parent.addEventListener("mouseleave", handleParentMouseLeave);

//     return () => {
//       parent.removeEventListener("mouseenter", handleParentMouseEnter);
//       parent.removeEventListener("mouseleave", handleParentMouseLeave);
//     };
//   }, [hoverGroup, triggerOnHover]);

//   return (
//     <MotionComponent
//       ref={elementRef}
//       className={cn(
//         "leading-20 tracking-[-0.02em]",
//         Component === "span" && "inline-block",
//         className,
//       )}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       {...props}
//     >
//       {textToShow}
//       {shouldShowCursor && (
//         <span
//           className={cn(
//             "inline-block font-sans", // Add font-sans or font-poppins here
//             blinkCursor && "animate-blink-cursor",
//           )}
//         >
//           {getCursorChar()}
//         </span>
//       )}
//     </MotionComponent>
//   );
// }
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
  type RefObject,
} from "react";
import {
  motion,
  useInView,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const;

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>;
type TypingAnimationMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
>;

interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children?: string;
  words?: string[];
  className?: string;
  duration?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDelay?: number;
  loop?: boolean;
  as?: MotionElementType;
  startOnView?: boolean;
  showCursor?: boolean;
  blinkCursor?: boolean;
  cursorStyle?: "line" | "block" | "underscore";
  triggerOnHover?: boolean;
  fallbackText?: string;
  resetOnHoverExit?: boolean;
  hoverGroup?: string;
  disableOnMobile?: boolean; // New prop to disable on mobile
}

export function TypingAnimation({
  children,
  words,
  className,
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 300,
  loop = false,
  as: Component = "span",
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = "block",
  triggerOnHover = false,
  fallbackText = "",
  resetOnHoverExit = false,
  hoverGroup,
  disableOnMobile = true, // Default to true
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motionElements[
    Component
  ] as TypingAnimationMotionComponent;

  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pause" | "deleting">("typing");
  const [isHovered, setIsHovered] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isGroupHovered, setIsGroupHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const wordsToAnimate = useMemo(
    () => words ?? (children ? [children] : []),
    [words, children],
  );
  const hasMultipleWords = wordsToAnimate.length > 1;

  const typingSpeed = typeSpeed ?? duration;
  const deletingSpeed = deleteSpeed ?? typingSpeed / 2;

  // Determine if animation should start
  // On mobile, if disableOnMobile is true, always show fallback text
  const shouldStart =
    disableOnMobile && isMobile
      ? false
      : triggerOnHover
        ? isHovered || isGroupHovered
        : startOnView
          ? isInView
          : true;

  // Check if should show fallback
  const shouldShowFallback =
    (triggerOnHover && !shouldStart && fallbackText) ||
    (disableOnMobile && isMobile && fallbackText);

  const animationSourceKey = useMemo(
    () => (words ? words.join("\u0000") : (children ?? "")),
    [words, children],
  );

  // Reset animation when hover ends (if enabled)
  useEffect(() => {
    if (triggerOnHover && resetOnHoverExit && !shouldStart && hasStarted) {
      setDisplayedText("");
      setCurrentWordIndex(0);
      setCurrentCharIndex(0);
      setPhase("typing");
      setHasStarted(false);
    }
  }, [shouldStart, triggerOnHover, resetOnHoverExit, hasStarted]);

  // Reset animation when source changes
  useEffect(() => {
    setDisplayedText("");
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setPhase("typing");
    setHasStarted(false);
  }, [animationSourceKey]);

  // Main animation logic
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (shouldStart && wordsToAnimate.length > 0) {
      if (!hasStarted) setHasStarted(true);

      const currentWord = wordsToAnimate[currentWordIndex] || "";
      const graphemes = Array.from(currentWord);

      const timeoutDelay =
        delay > 0 && displayedText === "" && currentCharIndex === 0
          ? delay
          : phase === "typing"
            ? typingSpeed
            : phase === "deleting"
              ? deletingSpeed
              : pauseDelay;

      timeout = setTimeout(() => {
        const currentWord = wordsToAnimate[currentWordIndex] || "";
        const graphemes = Array.from(currentWord);

        switch (phase) {
          case "typing":
            if (currentCharIndex < graphemes.length) {
              setDisplayedText(
                graphemes.slice(0, currentCharIndex + 1).join(""),
              );
              setCurrentCharIndex(currentCharIndex + 1);
            } else {
              if (hasMultipleWords || loop) {
                const isLastWord =
                  currentWordIndex === wordsToAnimate.length - 1;
                if (!isLastWord || loop) {
                  setPhase("pause");
                }
              }
            }
            break;

          case "pause":
            setPhase("deleting");
            break;

          case "deleting":
            if (currentCharIndex > 0) {
              setDisplayedText(
                graphemes.slice(0, currentCharIndex - 1).join(""),
              );
              setCurrentCharIndex(currentCharIndex - 1);
            } else {
              const nextIndex = (currentWordIndex + 1) % wordsToAnimate.length;
              setCurrentWordIndex(nextIndex);
              setPhase("typing");
            }
            break;
        }
      }, timeoutDelay);
    }

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
      }
    };
  }, [
    shouldStart,
    phase,
    currentCharIndex,
    currentWordIndex,
    displayedText,
    wordsToAnimate,
    hasMultipleWords,
    loop,
    typingSpeed,
    deletingSpeed,
    pauseDelay,
    delay,
    hasStarted,
  ]);

  const currentWordGraphemes = Array.from(
    wordsToAnimate[currentWordIndex] || "",
  );
  const isComplete =
    !loop &&
    currentWordIndex === wordsToAnimate.length - 1 &&
    currentCharIndex >= currentWordGraphemes.length &&
    phase !== "deleting";

  // ONLY show cursor when actively typing or deleting
  // And NOT showing fallback text
  const shouldShowCursor =
    showCursor &&
    shouldStart &&
    !shouldShowFallback &&
    (phase === "typing" || phase === "deleting") &&
    !isComplete;

  const getCursorChar = () => {
    switch (cursorStyle) {
      case "block":
        return "▌";
      case "underscore":
        return "_";
      case "line":
      default:
        return "|";
    }
  };

  const getDisplayText = () => {
    if (shouldShowFallback) {
      return fallbackText;
    }
    return displayedText;
  };

  const textToShow = getDisplayText();

  // Handle hover events - only on non-mobile
  const handleMouseEnter = () => {
    if (triggerOnHover && !(disableOnMobile && isMobile)) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover && !(disableOnMobile && isMobile)) {
      setIsHovered(false);
    }
  };

  // Group hover support - only on non-mobile
  useEffect(() => {
    if (!hoverGroup || !triggerOnHover || !elementRef.current) return;
    if (disableOnMobile && isMobile) return;

    const element = elementRef.current;
    const parent = element.closest(
      `[data-hover-group="${hoverGroup}"]`,
    ) as HTMLElement;

    if (!parent) return;

    const handleParentMouseEnter = () => {
      setIsGroupHovered(true);
    };

    const handleParentMouseLeave = () => {
      setIsGroupHovered(false);
    };

    parent.addEventListener("mouseenter", handleParentMouseEnter);
    parent.addEventListener("mouseleave", handleParentMouseLeave);

    return () => {
      parent.removeEventListener("mouseenter", handleParentMouseEnter);
      parent.removeEventListener("mouseleave", handleParentMouseLeave);
    };
  }, [hoverGroup, triggerOnHover, isMobile, disableOnMobile]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        "leading-20 tracking-[-0.02em]",
        Component === "span" && "inline-block",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {textToShow}
      {shouldShowCursor && (
        <span
          className={cn(
            "inline-block font-sans",
            blinkCursor && "animate-blink-cursor",
          )}
        >
          {getCursorChar()}
        </span>
      )}
    </MotionComponent>
  );
}
