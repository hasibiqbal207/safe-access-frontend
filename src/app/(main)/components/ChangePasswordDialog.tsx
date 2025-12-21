"use client";
import React from "react";
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
import { Loader } from "lucide-react";
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
            toast({
                title: "Error",
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                        Enter your current password and choose a new one.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            {...register("currentPassword", {
                                required: "Current password is required",
                            })}
                        />
                        {errors.currentPassword && (
                            <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            {...register("newPassword", {
                                required: "New password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters",
                                },
                            })}
                        />
                        {errors.newPassword && (
                            <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === watch("newPassword") || "Passwords do not match",
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
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
