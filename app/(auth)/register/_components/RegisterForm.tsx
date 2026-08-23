"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed, CircleAlert, UserPlus } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { TypingAnimation } from "@/components/ui/magicui/typewrite-hover";
import { AuroraText } from "@/components/ui/aurora-text";
import Link from "next/link";

// Updated schema for sign up (includes name and password confirmation)
const SignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Please enter your email")
      .email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);

    // Use Better Auth's signUp method (not signIn)
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    setIsLoading(false);

    if (error) {
      toast.custom((t) => (
        <div className="flex-between w-full rounded-lg bg-secondary p-4 font-sans shadow gap-4">
          <div className="flex items-center gap-2">
            {/* <CircleAlert className="h-5 w-5" /> */}
            <div className="relative size-10">
              <div className="text-2xl z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                ⚠️
              </div>
              <div className="z-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 aspect-square size-7 rounded-full bg-accent"></div>
            </div>

            <div>
              <div className="text-sm font-semibold">Registration Failed!</div>
              <div className="text-xs">{error.message}</div>
            </div>
          </div>
          <Button
            onClick={() => toast.dismiss(t)}
            size={"sm"}
            variant={"ghost"}
            className="dark: border border-accent-foreground bg-card font-semibold text-accent-foreground"
          >
            Got it
          </Button>
        </div>
      ));
      return;
    }

    // Success
    toast.custom((t) => (
      <div className="flex-between w-full rounded-lg bg-linear-to-r from-primary to-secondary p-4 font-sans text-white shadow dark:to-accent">
        <div className="flex items-center gap-2">
          <CircleAlert className="h-5 w-5" />
          <div>
            <div className="text-sm font-semibold">Welcome aboard!</div>
            <div className="text-xs">Account created successfully!</div>
          </div>
        </div>
        <Button
          onClick={() => toast.dismiss(t)}
          size={"sm"}
          variant={"ghost"}
          className="dark: border border-accent-foreground bg-card font-semibold text-accent-foreground"
        >
          Got it
        </Button>
      </div>
    ));

    // Redirect after successful registration
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="flex-center h-full w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex w-full flex-col gap-2 pb-8 px-10 pt-5", className)}
        {...props}
      >
        <FieldGroup className="">
          <div className="flex flex-col items-center gap-0 text-center -mb-5">
            <h1 className="flex-center gap-2 text-sm font-extrabold text-pretty">
              Sign up now,
            </h1>
            <h1 className="flex-center gap-2 text-3xl font-extrabold text-pretty">
              <span className="flex-center gap-1">
                Beautiful
                <AuroraText className="">baby </AuroraText>
              </span>
              <span className="text-3xl">🐥</span>
            </h1>
            <p className="flex-center text-xs text-balance text-muted-foreground">
              <span>
                you know, to have your progress be actually <s>stolen</s>{" "}
                tracked
              </span>
            </p>
          </div>

          <div className="space-y-3">
            {/* Name Field */}
            <Field className="gap-1">
              <FieldLabel
                className="gap-1 text-xs font-semibold text-primary dark:text-foreground"
                htmlFor="name"
              >
                🙋🏻‍♀️ Full Name
              </FieldLabel>
              <Input
                id="name"
                placeholder="Juan Dela Cruz"
                {...register("name")}
                aria-invalid={!!errors.name}
                className="text-primary placeholder:text-primary/45 dark:text-foreground dark:placeholder:text-input"
              />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            {/* Email Field */}
            <Field className="gap-1">
              <FieldLabel
                className="gap-1 text-xs font-semibold text-primary dark:text-foreground"
                htmlFor="email"
              >
                💌Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="juan@email.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="text-primary placeholder:text-primary/45 dark:text-foreground dark:placeholder:text-input"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            {/* Password Field */}
            <Field className="gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel
                  className="gap-1 text-xs font-semibold text-primary dark:text-foreground"
                  htmlFor="password"
                >
                  🎫Password
                </FieldLabel>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className="text-primary placeholder:text-primary/45 dark:text-foreground dark:placeholder:text-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full text-primary hover:text-primary active:translate-y-[-45%]! dark:text-foreground hover:bg-primary/20 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <span className="text-lg">👀</span>
                  ) : (
                    <span className="text-lg">🫣</span>
                  )}
                </Button>
              </div>
              <FieldError>{errors.password?.message}</FieldError>
            </Field>

            {/* Confirm Password Field */}
            <Field className="gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel
                  className="gap-1 text-xs font-semibold text-primary dark:text-foreground"
                  htmlFor="confirmPassword"
                >
                  🔄Confirm Password
                </FieldLabel>
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                  className="text-primary placeholder:text-primary/45 dark:text-foreground dark:placeholder:text-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full text-primary hover:text-primary active:translate-y-[-45%]! dark:text-foreground hover:bg-primary/20 cursor-pointer"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <span className="text-lg">👀</span>
                  ) : (
                    <span className="text-lg">🫣</span>
                  )}
                </Button>
              </div>
              <FieldError>{errors.confirmPassword?.message}</FieldError>
            </Field>
          </div>

          {/* Submit Button */}
          <Field
            className={cn(isLoading && "cursor-progress")}
            data-hover-group="button-group"
          >
            <Button
              type="submit"
              disabled={isLoading}
              size={"lg"}
              className={"text-lg text-center flex-center font-mono"}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Creating account...
                </>
              ) : (
                <>
                  <span>✍🏻</span>
                  <TypingAnimation
                    triggerOnHover={true}
                    resetOnHoverExit={true}
                    fallbackText="Sign Me Up Baby"
                    words={["Lezzzzzz", "ᕕ( ᐛ )ᕗ Gooooooo!"]}
                    loop={true}
                    hoverGroup="button-group"
                    disableOnMobile={true} // This will disable the animation on mobile
                    blinkCursor={true}
                  />
                </>
              )}
            </Button>
          </Field>
          <div className="">
            <p className="text-center text-xs text-muted-foreground">
              Go back to{" "}
              <Link className="text-primary hover:underline" href="/login">
                Log in?
              </Link>
            </p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
