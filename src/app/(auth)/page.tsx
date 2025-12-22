"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/form";
import { Input } from "@/app/components/input";
import { Button } from "@/app/components/button";
import { loginMutationFn } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { setCookie } from "cookies-next";

// Define response and error types
interface LoginResponse {
  data: {
    success?: boolean;
    message?: string;
    data: {
      user?: {
        is2FAEnabled: boolean;
      };
      requires2FA?: boolean;
      // For MFA flow
      intermediateToken?: string;
      // For non-MFA flow
      accessToken?: string;
      refreshToken?: string;
    }
  }
}

interface LoginError {
  message: string;
}

// Create a temporary storage mechanism for MFA flow
const MFA_TEMP_STORAGE_KEY = 'mfa_temp_auth';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email().min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  // Define type for form values
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: (response: LoginResponse) => {
        if (!response.data.data) {
          console.error("Response data is undefined or null");
          toast({
            title: "Error",
            description: "Invalid response from server",
            variant: "destructive",
          });
          return;
        }


        // Check if MFA is required
        if (response.data.data.requires2FA || (response.data.data.user && response.data.data.user.is2FAEnabled)) {
          const tempAuthData = {
            intermediateToken: response.data.data.intermediateToken,
            email: values.email,
            timestamp: Date.now()
          };

          // Store intermediate token temporarily in session storage
          sessionStorage.setItem(MFA_TEMP_STORAGE_KEY, JSON.stringify(tempAuthData));

          // Redirect to MFA verification page
          router.push(`/verify-mfa?email=${values.email}`);
          return;
        }

        // If no MFA required, store tokens normally
        storeAuthTokens(response.data.data.accessToken, response.data.data.refreshToken);

        // Redirect to home page
        navigateToHome();
      },
      onError: (error: LoginError) => {
        console.error("Login error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  // Helper function to store auth tokens
  const storeAuthTokens = (accessToken?: string, refreshToken?: string) => {
    if (accessToken) {
      setCookie("accessToken", accessToken, {
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      localStorage.setItem("accessToken", accessToken);
    }

    if (refreshToken) {
      setCookie("refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  // Helper function to navigate to home
  const navigateToHome = () => {
    try {
      router.push("/home");
      setTimeout(() => {
        if (window.location.pathname === "/") {
          window.location.href = "/home";
        }
      }, 500);
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/home";
    }
  };

  return (
    <main className="w-full min-h-[590px] h-auto max-w-full pt-10">
      <div className="w-full h-full p-5 rounded-md">
        <h1 className="text-xl tracking-[-0.16px] text-gray-900 dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
          Log in to Safe Access
        </h1>
        <p className="mb-8 text-center sm:text-left text-base text-gray-700 dark:text-[#f1f7feb5] font-normal">
          Don&apos;t have an account?{" "}
          <Link className="text-primary" href="/signup">
            Sign up
          </Link>
          .
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-[#f1f7feb5] text-sm">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="user@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-[#f1f7feb5] text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••••••"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4 flex w-full items-center justify-end">
              <Link
                className="text-sm text-gray-900 dark:text-white"
                href={`/forgot-password?email=${form.getValues().email}`}
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              className="w-full text-[15px] h-[40px] text-white font-semibold"
              disabled={isPending}
              type="submit"
            >
              {isPending && <Loader className="animate-spin" />}
              Sign in
              <ArrowRight />
            </Button>
          </form>
        </Form>
        <p className="text-xs text-gray-600 dark:text-slate-400 font-normal mt-7">
          By signing in, you agree to our{" "}
          <Link className="text-primary hover:underline" href="/terms-of-service">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link className="text-primary hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
