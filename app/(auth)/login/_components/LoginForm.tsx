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
import { LogIn, Eye, EyeClosed, CircleAlert } from "lucide-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/sonner";

// import { useRouter } from "next/navigation"
// import { Spinner } from "@/components/ui/shadcn-io/spinner";
import Image from "next/image";
import { useState } from "react";

import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { AuroraText } from "@/components/ui/aurora-text";
import { TypingAnimation } from "@/components/ui/magicui/typewrite-hover";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().min(1, "Please give us your email"),
  password: z.string().min(6, "Please input your password"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const { error } = await authClient.signIn.email({
      ...data,
    });

    setIsLoading(false);
    if (error) {
      toast.custom((t) => (
        <div className="flex-between w-full rounded-lg bg-secondary p-4 font-sans shadow gap-4">
          <div className="flex items-center gap-2">
            {/* <CircleAlert className="h-5 w-5" /> */}
            <span className="text-3xl rounded-full p-1 aspect-square border bg-accent">
              ⚠️
            </span>
            <div>
              <div className="text-sm font-semibold">Invalid Credentials!</div>
              <div className="text-xs">{error.message}</div>
            </div>
          </div>
          <Button
            onClick={() => toast.dismiss(t)}
            size={"sm"}
            className="border border-accent-foreground bg-primary-foreground font-semibold text-accent-foreground"
          >
            Got it
          </Button>
        </div>
      ));
    } else {
      toast.custom((t) => (
        <div className="flex-between w-full rounded-lg bg-linear-to-r from-destructive to-secondary p-4 font-sans text-white shadow dark:to-accent">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Welcome back!</div>
              <div className="text-xs">Login Successfully!</div>
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
      redirect ? router.push(redirect) : router.back();
      router.refresh();
    }

    // console.log("✅ Login submitted:", data)
    // toast("You submitted the following values", {
    //   description: (
    //     <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
    // try {
    //   const signInResponse = await signIn("credentials", {
    //     login_name: data.email,
    //     password: data.password,
    //     redirect: false,
    //   });
    //   if (!signInResponse || !signInResponse.ok || signInResponse.error) {
    //     console.log("Invalid Credentials!", signInResponse?.error);

    //     toast.custom((t) => (
    //       <div className="bg-gradient-to-r from-destructive dark:to-accent to-secondary text-white p-4 rounded-lg shadow font-sans  flex-between w-full">
    //         <div className="flex items-center gap-2">
    //           <CircleAlert className="h-5 w-5" />
    //           <div>
    //             <div className="font-semibold text-sm">Wrong Credentials!</div>
    //             <div className="text-xs">Incorrect email or password</div>
    //           </div>
    //         </div>
    //         <Button
    //           onClick={() => toast.dismiss(t)}
    //           size={"sm"}
    //           variant={"ghost"}
    //           className="bg-card text-accent-foreground dark: border border-accent-foreground font-semibold"
    //         >
    //           Got it
    //         </Button>
    //       </div>
    //     ));
    //     setIsLoading(false);
    //   } else {
    //     router.push("/dashboard");
    //     console.log(signInResponse);
    //     setIsLoading(true);
    //   }
    // } catch (error) {
    //   // console.log(error);

    //   const errorMessage =
    //     error instanceof TypeError
    //       ? "Network error, please try again later"
    //       : "Invalid credentials";

    //   // toast("Uh Oh", {
    //   //   description: errorMessage,
    //   // });
    //   toast.custom((t) => (
    //     <div className="bg-gradient-to-r from-destructive dark:to-accent to-secondary text-white p-4 rounded-lg shadow font-sans  flex-between w-full">
    //       <div className="flex items-center gap-2">
    //         <CircleAlert className="h-5 w-5" />
    //         <div>
    //           <div className="font-semibold text-sm">Uh Oh</div>
    //           <div className="text-xs">{errorMessage}</div>
    //         </div>
    //       </div>
    //       <Button
    //         onClick={() => toast.dismiss(t)}
    //         size={"sm"}
    //         variant={"ghost"}
    //         className="bg-card text-accent-foreground dark: border border-accent-foreground font-semibold"
    //       >
    //         Got it
    //       </Button>
    //     </div>
    //   ));

    //   setIsLoading(false);
    // }
  };

  return (
    <div className="flex-center h-full w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex w-full flex-col gap-2 py-12 px-10", className)}
        {...props}
      >
        <FieldGroup className="">
          <div className="flex flex-col items-center gap-0 text-center">
            <h1 className="flex-center gap-2 text-sm font-extrabold text-pretty">
              Sign in now,
            </h1>
            <h1 className="flex-center gap-2 text-3xl font-extrabold text-pretty">
              <span className="flex-center gap-1">
                chick
                <AuroraText className="">baby </AuroraText>
              </span>
              <span className="text-3xl">🐥</span>
            </h1>
            <p className="flex-center text-xs text-balance text-muted-foreground">
              <span>
                you know, to have your data be actually <s>stolen</s> recorded
              </span>
            </p>
          </div>

          <div className="space-y-3">
            {/* email Field */}
            <Field className="gap-1">
              <FieldLabel
                className="gap-1 text-xs font-semibold text-primary dark:text-foreground"
                htmlFor="email"
              >
                💌Email
              </FieldLabel>
              <Input
                id="email"
                placeholder="juan@email.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                className="text-primary placeholder:text-primary/45 dark:text-foreground dark:placeholder:text-input"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            {/* Password Field with Toggle */}
            <Field className="gap-1">
              <div className="flex items-center justify-between">
                <FieldLabel
                  className="gap-1 text-xs font-semibold text-primary dark:text-foreground "
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
                  size="icon"
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
          </div>

          {/* Submit Button */}
          <Field
            className={cn(isLoading && "cursor-progress")}
            data-hover-group="button-group"
          >
            <Button
              type="submit"
              // disabled={isLoading}
              size={"lg"}
              className={"text-lg text-center flex-center font-mono"}
            >
              {isLoading && "Athenticating..."}
              {!isLoading ? (
                <span className="text-lg text-shadow-2xs">🚀</span>
              ) : (
                <Spinner />
              )}
              {!isLoading && (
                <TypingAnimation
                  triggerOnHover={true}
                  resetOnHoverExit={true}
                  fallbackText="I want in"
                  words={["Lezzzzzz", "Goooooooooooooooooooo!"]}
                  loop={true}
                  hoverGroup="button-group"
                  disableOnMobile={true} // This will disable the animation on mobile
                  blinkCursor={true}
                />
              )}
            </Button>
          </Field>
          <div className="">
            <p className="text-center text-xs text-muted-foreground">
              New here?{" "}
              <Link className="text-primary hover:underline" href="/register">
                Create an account
              </Link>
            </p>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}
