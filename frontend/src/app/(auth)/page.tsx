"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader } from "lucide-react";
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
          console.log("2FA required, storing temporary tokens and redirecting to verification page");
          
          // Store tokens temporarily in session storage (more secure than localStorage)
          // This data will be cleared after MFA verification or when the session ends
          sessionStorage.setItem(MFA_TEMP_STORAGE_KEY, JSON.stringify({
            accessToken: response.data.data.accessToken,
            refreshToken: response.data.data.refreshToken,
            email: values.email,
            timestamp: Date.now() // Add timestamp for potential expiry checks
          }));
          
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
        <h1 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold mb-1.5 mt-8 text-center sm:text-left">
          Log in to Safe Access
        </h1>
        <p className="mb-8 text-center sm:text-left text-base dark:text-[#f1f7feb5] font-normal">
          Don't have an account?{" "}
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
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
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
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-4 flex w-full items-center justify-end">
              <Link
                className="text-sm dark:text-white"
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

            <div className="mb-6 mt-6 flex items-center justify-center">
              <div
                aria-hidden="true"
                className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                data-orientation="horizontal"
                role="separator"
              ></div>
              <span className="mx-4 text-xs dark:text-[#f1f7feb5] font-normal">
                OR
              </span>
              <div
                aria-hidden="true"
                className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                data-orientation="horizontal"
                role="separator"
              ></div>
            </div>
          </form>
        </Form>
        <Button className="w-full h-[40px] variant='outline' "> 
          Email magic link
        </Button>
        <p className="text-xs dark:text-slate- font-normal mt-7">
          By signing in, you agree to our{" "}
          <a className="text-primary hover:underline" href="#">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="text-primary hover:underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
