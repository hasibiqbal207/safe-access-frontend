"use client";
import React, { useState } from "react";
import { Button } from "@/app/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/app/components/dialog";
import { Input } from "@/app/components/input";
import { Label } from "@/app/components/label";
import { toast } from "@/hooks/use-toast";
import { changePasswordMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";

type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ChangePasswordDialog = (props: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isOpen, setIsOpen } = props;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ChangePasswordFormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: changePasswordMutationFn,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Password changed successfully",
                variant: "default",
            });
            reset();
            setIsOpen(false);
        },
        onError: (error: any) => {
            // Check if it's a compromised password error
            const isCompromisedPassword =
                error?.code === "COMPROMISED_PASSWORD" ||
                error?.message?.toLowerCase().includes("breach") ||
                error?.message?.toLowerCase().includes("compromised");

            toast({
                title: isCompromisedPassword ? "Compromised Password" : "Error",
                description: error.message || "Failed to change password",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            toast({
                title: "Error",
                description: "New passwords do not match",
                variant: "destructive",
            });
            return;
        }
        mutate(data);
    };

    const passwordRequirements = [
        { text: "At least 8 characters long", met: watch("newPassword")?.length >= 8 },
        { text: "Contains uppercase and lowercase letters", met: /[a-z]/.test(watch("newPassword") || "") && /[A-Z]/.test(watch("newPassword") || "") },
        { text: "Contains at least one number", met: /\d/.test(watch("newPassword") || "") },
        { text: "Contains at least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(watch("newPassword") || "") },
        { text: "Not found in data breaches", met: true }, // This will be validated by backend
    ];

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new secure password.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                            <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="pr-10"
                                {...register("currentPassword", {
                                    required: "Current password is required",
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.currentPassword.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                className="pr-10"
                                {...register("newPassword", {
                                    required: "New password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                className="pr-10"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("newPassword") || "Passwords do not match",
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle size={14} />
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-foreground">Password Requirements:</p>
                        <ul className="space-y-1.5">
                            {passwordRequirements.map((req, index) => (
                                <li key={index} className="text-xs flex items-center gap-2">
                                    {watch("newPassword") && req.met ? (
                                        <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                    ) : (
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
                                    )}
                                    <span className={watch("newPassword") && req.met ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
                                        {req.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                            <AlertCircle size={12} className="inline mr-1" />
                            Your password will be checked against known data breaches for security.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                reset();
                                setIsOpen(false);
                            }}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="!text-white">
                            {isPending && <Loader className="animate-spin mr-2" size={16} />}
                            Change Password
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePasswordDialog;
