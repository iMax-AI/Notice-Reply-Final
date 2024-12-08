"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import { signInSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleCredentialsSignIn } from "@/app/actions/authActions";

import GlobalMessage from "@/components/GlobalMessage";

export default function SignUpForm() {
  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await handleCredentialsSignIn(values);

      if (result?.message) {
        setGlobalMessage(result.message);
        setGlobalSuccess("false");
      } else {
        setGlobalMessage("Sign-in successful");
        setGlobalSuccess("true");
        window.location.reload();
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setGlobalSuccess("false");
      setGlobalMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Image src="/logo.png" alt="Logo" width={125} height={125} />
      </div>
      <Card className="border-slate-950 shadow-md">
        {globalMessage && (
          <GlobalMessage success={globalSuccess} message={globalMessage} />
        )}
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Sign-In</CardTitle>
          <CardDescription>
            Enter your details to log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="test1234@gmail.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
                <Link
                  href="/forget-password"
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <CardFooter className="flex flex-col mt-4">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Signing In..." : "Sign In →"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
        <div className="bg-gradient-to-r from-transparent via-neutral-900 dark:via-neutral-700 to-transparent mb-4 h-[1px] w-full -mt-6" />
        <div className="flex flex-col justify-center items-center gap-4">
          <p className="text-neutral-950 text-base mb-2 text-center dark:text-neutral-300">
            Do not have an account?{" "}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
              <Link href="/auth/sign-up">Sign-Up</Link>
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}