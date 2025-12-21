"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { Check, Copy, Loader } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/dialog";
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
import { useAuthContext } from "@/context/auth-provider";
import { useQuery, useMutation } from "@tanstack/react-query";
import { mfaSetupQueryFn, mfaType, enableMFAMutationFn } from "@/lib/api";
import { Skeleton } from "@/app/components/skeleton";
import { toast } from "@/hooks/use-toast";
import RevokeMfa from "@/app/(main)/components/RevokeMfa";
import BackupCodesDialog from "@/app/(main)/components/BackupCodesDialog";

const EnableMfa = () => {
  //const queryClient = useQueryClient();
  const { user, refetch } = useAuthContext();
  const [showKey, setShowKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["mfa-setup"],
    queryFn: mfaSetupQueryFn,
    enabled: isOpen,
    staleTime: Infinity,
  });

  // Extract data correctly, handling potential nesting in the API response
  const mfaData = data && typeof data === 'object' && 'data' in data
    ? data.data as mfaType
    : (data as mfaType) ?? ({} as mfaType);

  // Debug log for component
  useEffect(() => {
    if (data) {
      console.log('MFA data in component:', data);
      // Check if the data has a nested data property (common in REST APIs)
      if (typeof data === 'object' && 'data' in data) {
        console.log('Data is nested in a data property, extracting...');
      }
    }
    if (error) {
      console.error('MFA setup error:', error);
    }
  }, [data, error]);

  const { mutate, isPending } = useMutation({
    mutationFn: enableMFAMutationFn,
  });

  const FormSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be 6 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // Ensure QR code URL is properly formatted as a data URL
  const sanitizedQrCodeUrl = useMemo(() => {
    if (!mfaData?.qrCodeUrl) return '';

    // If it's already a properly formatted data URL, return as is
    if (mfaData.qrCodeUrl.startsWith('data:image/')) {
      return mfaData.qrCodeUrl;
    }

    // If it's just the base64 content without the data URL prefix, add it
    if (mfaData.qrCodeUrl.startsWith('/9j/') || mfaData.qrCodeUrl.startsWith('iVBOR')) {
      return `data:image/png;base64,${mfaData.qrCodeUrl}`;
    }

    return mfaData.qrCodeUrl;
  }, [mfaData.qrCodeUrl]);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    console.log('Starting submit with values:', values);
    console.log('MFA data available:', mfaData);

    // The backend only expects the token parameter
    const data = {
      token: values.pin,
    };

    console.log('Sending data to enable MFA:', data);

    mutate(data, {
      onSuccess: (response) => {
        console.log('MFA enable success response:', response);

        // Extract backup codes from response
        const codes = response?.data?.backupCodes || response?.data?.data?.backupCodes || [];

        if (codes && codes.length > 0) {
          setBackupCodes(codes);
          setShowBackupCodes(true);
        }

        refetch();
        setIsOpen(false);
        toast({
          title: "Success",
          description: response.data.message || "MFA has been enabled successfully",
        });
      },
      onError: (error: { message: string }) => {
        console.error('MFA enable error:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }
  const onCopy = useCallback((value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
      <div className="rounded-[10px]">
        <div className="flex items-center gap-3">
          <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
            Multi-Factor Authentication (MFA)
          </h3>
          {user?.is2FAEnabled && (
            <span
              className="select-none whitespace-nowrap font-medium bg-green-100 text-green-500
          text-xs h-6 px-2 rounded flex flex-row items-center justify-center gap-1"
            >
              Enabled
            </span>
          )}
        </div>

        <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Protect your account by adding an extra layer of security.
        </p>
        {user?.is2FAEnabled ? (
          <RevokeMfa />
        ) : (
          <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading} className="h-[35px] text-white">
                Enable MFA
              </Button>
            </DialogTrigger>
            <DialogContent className="!gap-0">
              <DialogHeader>
                <DialogTitle className="text-[17px] text-slate-12 font-semibold">
                  Setup Multi-Factor Authentication
                </DialogTitle>
              </DialogHeader>
              <div className="">
                <p className="mt-6 text-sm text-[#0007149f] dark:text-inherit font-bold">
                  Scan the QR code
                </p>
                <span className="text-sm text-[#0007149f] dark:text-inherit font-normal">
                  Use an app like{" "}
                  <a
                    className="!text-primary underline decoration-primary decoration-1 underline-offset-2 transition duration-200 ease-in-out hover:decoration-blue-11 dark:text-current dark:decoration-slate-9 dark:hover:decoration-current "
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://support.1password.com/one-time-passwords/"
                  >
                    1Password
                  </a>{" "}
                  or{" "}
                  <a
                    className="!text-primary underline decoration-primary decoration-1 underline-offset-2 transition duration-200 ease-in-out hover:decoration-blue-11 dark:text-current dark:decoration-slate-9 dark:hover:decoration-current "
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://safety.google/authentication/"
                  >
                    Google Authenticator
                  </a>{" "}
                  to scan the QR code below.
                </span>
              </div>
              <div className="mt-4 flex flex-row items-center gap-4">
                <div className=" shrink-0 rounded-md border p-2  border-[#0009321f] dark:border-gray-600 bg-white">
                  {isLoading || !mfaData?.qrCodeUrl ? (
                    <Skeleton className="w-[160px] h-[160px]" />
                  ) : (
                    <Image
                      alt="QR code"
                      src={sanitizedQrCodeUrl}
                      width={160}
                      height={160}
                      className="rounded-md"
                      onError={(e) => {
                        console.error('QR code image failed to load');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                </div>

                {showKey ? (
                  <div className="w-full">
                    <div
                      className="flex items-center gap-1
                              text-sm text-[#0007149f] dark:text-muted-foreground font-normal"
                    >
                      <span>Copy setup key</span>
                      <button
                        disabled={copied}
                        onClick={() => onCopy(mfaData?.secret || '')}
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm block truncate w-[200px] text-black dark:text-muted-foreground">
                      {mfaData?.secret || 'No secret key available'}
                    </p>
                  </div>
                ) : (
                  <span className="text-sm text-[#0007149f] dark:text-muted-foreground font-normal">
                    Can&apos;t scan the code?
                    <button
                      className="block text-primary transition duration-200 ease-in-out hover:underline
                   dark:text-white"
                      type="button"
                      onClick={() => setShowKey(true)}
                    >
                      View the Setup Key
                    </button>
                  </span>
                )}
              </div>

              <div className="mt-8 border-t">
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
                          <FormLabel className="text-sm mb-1 text-slate-11 font-bold">
                            Then enter the code
                          </FormLabel>
                          <FormControl>
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={isPending} className="w-full h-[40px]">
                      {isPending && <Loader className="animate-spin" />}
                      Verify
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Backup Codes Dialog */}
      <BackupCodesDialog
        isOpen={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
        backupCodes={backupCodes}
      />
    </div>
  );
};

export default EnableMfa;
