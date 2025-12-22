"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/app/components/button";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { verifyEmailMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { mutate, isPending } = useMutation({
        mutationFn: verifyEmailMutationFn,
        onSuccess: () => {
            setVerificationStatus("success");
            toast({
                title: "Success",
                description: "Email verified successfully! You can now log in.",
            });
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/");
            }, 3000);
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || error.message || "Invalid or expired verification token";
            setErrorMessage(errorMsg);
            setVerificationStatus("error");
            toast({
                title: "Verification Failed",
                description: errorMsg,
                variant: "destructive",
            });
        },
    });

    useEffect(() => {
        if (token) {
            // Automatically verify when component mounts with a token
            mutate({ verification_token: token });
        } else {
            setVerificationStatus("error");
        }
    }, [token]);

    return (
        <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center">
            <div className="w-full h-full p-5 rounded-md flex flex-col items-center justify-center gap-4">
                {verificationStatus === "pending" && (
                    <>
                        <Loader className="animate-spin size-12 text-primary" />
                        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold text-center">
                            Verifying your email...
                        </h1>
                        <p className="text-center text-sm text-muted-foreground dark:text-[#f1f7feb5]">
                            Please wait while we verify your email address.
                        </p>
                    </>
                )}

                {verificationStatus === "success" && (
                    <>
                        <CheckCircle className="size-12 text-green-500" />
                        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold text-center">
                            Email Verified Successfully!
                        </h1>
                        <p className="text-center text-sm text-muted-foreground dark:text-[#f1f7feb5]">
                            Your email has been verified. Redirecting to login...
                        </p>
                        <Link href="/">
                            <Button className="h-[40px]">
                                Go to Login
                            </Button>
                        </Link>
                    </>
                )}

                {verificationStatus === "error" && (
                    <>
                        <XCircle className="size-12 text-red-500" />
                        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold text-center">
                            Verification Failed
                        </h1>
                        <p className="text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] mb-2">
                            {!token
                                ? "No verification token provided"
                                : errorMessage || "Invalid or expired verification token. Please request a new verification email."}
                        </p>
                        <Link href="/">
                            <Button className="h-[40px]">
                                Go to Login
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}
