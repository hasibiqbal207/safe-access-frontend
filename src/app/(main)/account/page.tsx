"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/context/auth-provider";
import { User, Mail, Calendar, Shield, Trash2, Key, Send } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationEmailMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import ChangeEmailDialog from "../components/ChangeEmailDialog";
import DeleteAccountDialog from "../components/DeleteAccountDialog";

const AccountPage = () => {
    const { user, isLoading, refetch } = useAuthContext();
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

    const { mutate: resendVerification, isPending: isResending } = useMutation({
        mutationFn: resendVerificationEmailMutationFn,
        onSuccess: () => {
            toast({
                title: "Verification Email Sent",
                description: "Please check your email inbox for the verification link",
                variant: "default",
            });
            refetch(); // Refresh user data
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to send verification email",
                variant: "destructive",
            });
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex max-w-3xl flex-col gap-2 mx-auto w-full md:max-w-5xl px-6 py-8">
                <h1 className="text-[28px] leading-[34px] tracking-[-0.416px] text-[#000509e3] dark:text-inherit font-extrabold">
                    Account Settings
                </h1>
                <p className="text-sm text-[#0007149f] dark:text-gray-100 font-normal">
                    Manage your account information and preferences.
                </p>
            </div>

            <div className="max-w-3xl mx-auto w-full px-6 md:max-w-5xl space-y-6">
                {/* Profile Information Card */}
                <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
                    <div className="rounded-[10px] bg-white dark:bg-background p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-12">Profile Information</h3>
                                <p className="text-sm text-[#0007149f] dark:text-gray-400">
                                    Your personal account details
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Name */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <User className="w-5 h-5 mt-0.5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="text-base font-semibold text-slate-12">{user?.name || "N/A"}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Mail className="w-5 h-5 mt-0.5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="text-base font-semibold text-slate-12">{user?.email || "N/A"}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        {user?.isEmailVerified ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                ✓ Verified
                                            </span>
                                        ) : (
                                            <>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    ⚠ Not Verified
                                                </span>
                                                <button
                                                    onClick={() => resendVerification()}
                                                    disabled={isResending}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Send className="w-3 h-3" />
                                                    {isResending ? "Sending..." : "Verify Email"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2FA Status */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Shield className="w-5 h-5 mt-0.5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Two-Factor Authentication</p>
                                    <div className="mt-1">
                                        {user?.is2FAEnabled ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                ✓ Enabled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
                                                Disabled
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Account Created */}
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                <Calendar className="w-5 h-5 mt-0.5 text-gray-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</p>
                                    <p className="text-base font-semibold text-slate-12">
                                        {user?.createdAt ? format(new Date(user.createdAt), "PPP") : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Actions Card */}
                <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5">
                    <div className="rounded-[10px] bg-white dark:bg-background p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                <Key className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-12">Account Actions</h3>
                                <p className="text-sm text-[#0007149f] dark:text-gray-400">
                                    Manage your account security and settings
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {/* Change Password */}
                            <button
                                onClick={() => setIsChangePasswordOpen(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    <div className="text-left">
                                        <p className="text-base font-semibold text-slate-12">Change Password</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>

                            {/* Change Email */}
                            <button
                                onClick={() => setIsChangeEmailOpen(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors" />
                                    <div className="text-left">
                                        <p className="text-base font-semibold text-slate-12">Change Email</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your email address</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">→</span>
                            </button>

                            {/* Delete Account */}
                            <button
                                onClick={() => setIsDeleteAccountOpen(true)}
                                className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600 transition-colors" />
                                    <div className="text-left">
                                        <p className="text-base font-semibold text-red-600 dark:text-red-400">Delete Account</p>
                                        <p className="text-sm text-red-500 dark:text-red-400/70">Permanently delete your account</p>
                                    </div>
                                </div>
                                <span className="text-red-400">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <ChangePasswordDialog isOpen={isChangePasswordOpen} setIsOpen={setIsChangePasswordOpen} />
            <ChangeEmailDialog isOpen={isChangeEmailOpen} setIsOpen={setIsChangeEmailOpen} />
            <DeleteAccountDialog isOpen={isDeleteAccountOpen} setIsOpen={setIsDeleteAccountOpen} />
        </div>
    );
};

export default AccountPage;
