"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

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

// import { IconBrandGoogle } from "@tabler/icons-react";

import { z } from "zod";
import { signUpSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "emailjs-com";

import VerifyEmail from "@/components/EmailVerification";
import { handleCredentialsSignUp } from "@/app/actions/authActions";
import GlobalMessage from "@/components/GlobalMessage";

interface ServerActionResponse {
  success: boolean
  message: string
}

const sendVerificationMessage = async ({
  fullname,
  email,
  otp,
}: {
  fullname: string;
  email: string;
  otp: string;
}) => {
  try {
    const templateParams = {
      from_name: "LegalAID AI",
      to_name: fullname,
      to_email: email,
      subject: "Email Verification Code",
      message: `Thank you for using LegalAID AI. Please use the following OTP to complete your verification:

        Your OTP code is: ${otp}

        This code is valid for the next 15 minutes. If you didn't request this, please ignore this email.
      `,
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID_OTP!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY!
    );

    return response;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export default function SignInForm() {
  const [isSuccess, setIsSuccess] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");

  const [globalMessage, setGlobalMessage] = useState("");
  const [globalSuccess, setGlobalSuccess] = useState("none");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      fullname: "",
      confirmPassword: "",
      verifyCode: Math.floor(100000 + Math.random() * 900000).toString(),
      verifyCodeExpiry: new Date(Date.now() + 900000),
    },
  });

  
  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const result: ServerActionResponse = await handleCredentialsSignUp(
        values
      );
      if (result.success) {
        setPassword(values.password);
        setEmail(values.email);
        setFullname(values.fullname);

        const result = await sendVerificationMessage({
          fullname: values.fullname,
          email: values.email,
          otp: values.verifyCode,
        });
        if (result.status === 200) {
          setIsSuccess(true);
          setGlobalMessage("Message sent successfully!");
          setGlobalSuccess("true");
        }

        setGlobalMessage("OTP sent successfully!");
        setGlobalSuccess("true");
        setIsSuccess(true);
      } else {
        setGlobalMessage(result.message);
        setGlobalSuccess("false");
      }
    } catch (error) {
      setGlobalSuccess("false");
      setGlobalMessage("An unexpected error occurred.");
    }
  };
  

  return (
    <div className="h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {!isSuccess ? (
        <>
          <div className="mb-6">
            <Image src="/logo.png" alt="Logo" width={125} height={125} />
          </div>
          <Card className=" border-slate-950 shadow-md">
            {globalMessage && (
              <GlobalMessage success={globalSuccess} message={globalMessage} />
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold">Sign-Up</CardTitle>
              <CardDescription>
                Enter your details to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 mb-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your Full Name"
                        {...register("fullname")}
                        />
                      {errors.fullname && (
                        <p className="text-red-500 text-sm">
                          {errors.fullname.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="test1234@gmail.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor="confirmpassword">Confirm Password</Label>
                      <Input
                        id="confirmpassword"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <CardFooter className="flex flex-col -mb-6">
                  <Button className="w-full" type="submit">
                  {isSubmitting ? (
                    <>
                      <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                      </svg>
                      Loading...
                    </>
                  ) : (
                    <>
                      Sign up &rarr;
                    </>
                  )}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
            <div className="bg-gradient-to-r from-transparent via-neutral-900 dark:via-neutral-700 to-transparent mb-4 h-[1px] w-full" />
            <div className="flex flex-col justify-center items-center gap-4">
              {/* <button
                className="relative group w-full sm:w-[80%] flex gap-2 items-center justify-center px-4 text-black rounded-md h-10 font-medium shadow-md bg-gray-300 hover:bg-gray-400"
                type="button"
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Sign-Up with Google
                </span>
              </button> */}
              <p className="text-neutral-950 text-base mb-2 text-center dark:text-neutral-300">
                Already registered?{" "}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">
                  <Link href="/auth/sign-in">Sign-In</Link>
                </span>
              </p>
            </div>
          </Card>
        </>  
      ) : (
        <VerifyEmail email={email} fullname={fullname} password={password} />
      )}
    </div>
  );
}
