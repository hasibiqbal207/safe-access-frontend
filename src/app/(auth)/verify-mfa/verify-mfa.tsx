"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/app/components/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/form";

import { Button } from "@/app/components/button";
import { Input } from "@/app/components/input";
import { ArrowRight, Loader, Key } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { verifyMFALoginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { setCookie } from "cookies-next";

// MFA temporary storage key (must match the one in login page)
const MFA_TEMP_STORAGE_KEY = 'mfa_temp_auth';

// Interface for temporary MFA auth data
interface MFATempAuth {
  intermediateToken: string;
  email: string;
  timestamp: number;
}

const VerifyMfa = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const [tempAuthData, setTempAuthData] = useState<MFATempAuth | null>(null);
  const [useBackupCode, setUseBackupCode] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { token: string }) => {
      const currentTempAuthData = tempAuthData;

      if (!currentTempAuthData?.intermediateToken) {
        throw new Error('No intermediate token available');
      }

      return verifyMFALoginMutationFn(data, currentTempAuthData.intermediateToken);
    },
  });

  // Load temporary auth data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem(MFA_TEMP_STORAGE_KEY);

    if (!storedData) {
      toast({
        title: "Session Expired",
        description: "Your login session has expired. Please log in again.",
        variant: "destructive",
      });
      router.replace("/");
      return;
    }

    try {
      const parsedData = JSON.parse(storedData) as MFATempAuth;

      // Validate the stored email matches the URL parameter
      if (parsedData.email !== email) {
        throw new Error("Email mismatch");
      }

      // Check if the temporary auth data has expired (30 min timeout)
      const MAX_AGE = 30 * 60 * 1000; // 30 minutes
      if (Date.now() - parsedData.timestamp > MAX_AGE) {
        throw new Error("Session expired");
      }

      setTempAuthData(parsedData);
    } catch (error) {
      console.error("Invalid or expired temporary auth data:", error);
      sessionStorage.removeItem(MFA_TEMP_STORAGE_KEY);
      toast({
        title: "Session Error",
        description: "Your session has expired or is invalid. Please log in again.",
        variant: "destructive",
      });
      router.replace("/");
    }
  }, [email, router]);

  const FormSchema = z.object({
    pin: useBackupCode
      ? z.string().length(8, {
        message: "Backup code must be 8 characters.",
      })
      : z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Reset form when switching between TOTP and backup code
  useEffect(() => {
    form.reset({ pin: "" });
  }, [useBackupCode, form]);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (!email || !tempAuthData) {
      router.replace("/");
      return;
    }

    const data = {
      token: values.pin,
    };

    mutate(data, {
      onSuccess: (response) => {
        // Extract tokens from the response
        const responseData = response.data?.data || response.data;
        const accessToken = responseData?.accessToken;
        const refreshToken = responseData?.refreshToken;

        // Store the tokens permanently
        if (accessToken) {
          setCookie("accessToken", accessToken, {
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
          });
          localStorage.setItem("accessToken", accessToken);
        }

        if (refreshToken) {
          setCookie("refreshToken", refreshToken, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
          });
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Clear temporary storage
        sessionStorage.removeItem(MFA_TEMP_STORAGE_KEY);

        // Navigate to home
        router.replace("/home");
        toast({
          title: "Success",
          description: "Authentication successful",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message || "Invalid verification code",
          variant: "destructive",
        });
      },
    });
  };

  const handleReturnToSignIn = () => {
    // Clear any temporary data
    sessionStorage.removeItem(MFA_TEMP_STORAGE_KEY);
    router.replace("/");
  };

  // Show loading or redirect if no temp auth data is available
  if (tempAuthData === null) {
    return (
      <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={24} />
          <p>Verifying your session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center ">
      <div className="w-full h-full p-5 rounded-md">
        <h1
          className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mt-8
        text-center sm:text-left"
        >
          Multi-Factor Authentication
        </h1>
        <p className="mb-2 text-center sm:text-left text-[15px] dark:text-[#f1f7feb5] font-normal">
          {useBackupCode
            ? "Enter one of your backup codes."
            : "Enter the code from your authenticator app."}
        </p>
        <p className="mb-6 text-center sm:text-left text-[13px] text-amber-500 dark:text-amber-400 font-normal">
          {useBackupCode
            ? "Each backup code can only be used once. Make sure to save your remaining codes."
            : "This additional verification step is required to verify your identity and protect your account."}
        </p>

        <div className="mt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full mt-6 flex flex-col gap-4 "
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm mb-1 font-normal">
                      {useBackupCode ? "Backup code" : "One-time code"}
                    </FormLabel>
                    <FormControl>
                      {useBackupCode ? (
                        <Input
                          {...field}
                          placeholder="Enter 8-character backup code"
                          maxLength={8}
                          className="!h-12 !text-lg font-mono uppercase tracking-wider text-center"
                          onChange={(e) => {
                            // Convert to uppercase for consistency
                            const value = e.target.value.toUpperCase();
                            field.onChange(value);
                          }}
                        />
                      ) : (
                        <InputOTP
                          className="!text-lg flex items-center"
                          maxLength={6}
                          pattern={REGEXP_ONLY_DIGITS}
                          {...field}
                          style={{ justifyContent: "center" }}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={0}
                              className="!w-14 !h-12 !text-lg"
                            />
                            <InputOTPSlot
                              index={1}
                              className="!w-14 !h-12 !text-lg"
                            />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={2}
                              className="!w-14 !h-12 !text-lg"
                            />
                            <InputOTPSlot
                              index={3}
                              className="!w-14 !h-12 !text-lg"
                            />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot
                              index={4}
                              className="!w-14 !h-12 !text-lg"
                            />
                            <InputOTPSlot
                              index={5}
                              className="!w-14 !h-12 !text-lg"
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} className="w-full h-[40px] mt-2">
                {isPending && <Loader className="animate-spin" />}
                Continue
                <ArrowRight />
              </Button>
            </form>
          </Form>

          {/* Toggle between TOTP and Backup Code */}
          <Button
            type="button"
            variant="ghost"
            className="w-full text-sm mt-3 h-[40px] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            onClick={() => setUseBackupCode(!useBackupCode)}
          >
            {useBackupCode ? (
              <>Use authenticator app code instead</>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Use backup code instead
              </>
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-[15px] mt-2 h-[40px]"
          onClick={handleReturnToSignIn}
        >
          Return to sign in
        </Button>
      </div>
    </main>
  );
};

export default VerifyMfa;
