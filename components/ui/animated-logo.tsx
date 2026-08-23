import { SpinningText } from "./spinner-text";

export default function AnimatedLogo() {
  return (
    <div className="aspect-square flex-center w-24">
      <div className="scale-[0.26] flex-center bg-primary">
        <div className="relative flex-center w-full">
          <SpinningText
            reverse
            className="text-4xl text-foreground  absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium z-10"
          >
            now • we • lax •
          </SpinningText>
          {/* <SpinningText className="text-3xl blur-sm bg-blend-color-dodge absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            now • we • lax •
          </SpinningText> */}

          <h1 className="z-30 font-mono text-8xl text-card font-extrabold text-shadow-xs">
            nowel
          </h1>
          <h1 className="font-mono text-8xl text-card font-extrabold text-shadow-xs">
            ax
          </h1>
          <h1 className="font-mono blur-md animate-pulse text-8xl opacity-65 mix-blend-hard-light text-accent absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold dark:hidden">
            nowelax
          </h1>
        </div>
      </div>
    </div>
  );
}
