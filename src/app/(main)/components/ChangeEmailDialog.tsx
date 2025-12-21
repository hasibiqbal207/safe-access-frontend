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
import { changeUserEmailMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthContext } from "@/context/auth-provider";

type ChangeEmailFormData = {
    new_email: string;
};

const ChangeEmailDialog = (props: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isOpen, setIsOpen } = props;
    const { refetch } = useAuthContext();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangeEmailFormData>();

    const { mutate, isPending } = useMutation({
        mutationFn: changeUserEmailMutationFn,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Email change request sent. Please verify your new email.",
                variant: "default",
            });
            reset();
            setIsOpen(false);
            // Refetch user data to update the UI
            refetch();
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to change email",
                variant: "destructive",
            });
        },
    });

    const onSubmit = (data: ChangeEmailFormData) => {
        mutate(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Email Address</DialogTitle>
                    <DialogDescription>
                        Enter your new email address. You will need to verify it before the change takes effect.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="new_email">New Email Address</Label>
                        <Input
                            id="new_email"
                            type="email"
                            placeholder="Enter new email address"
                            {...register("new_email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address",
                                },
                            })}
                        />
                        {errors.new_email && (
                            <p className="text-sm text-red-500">{errors.new_email.message}</p>
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
                            Change Email
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeEmailDialog;
