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
import { deleteUserMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-provider";
import { deleteCookie } from "cookies-next";

const DeleteAccountDialog = (props: {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { isOpen, setIsOpen } = props;
    const { user } = useAuthContext();
    const router = useRouter();
    const [confirmText, setConfirmText] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: deleteUserMutationFn,
        onSuccess: () => {
            // Clear tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            deleteCookie("accessToken");
            deleteCookie("refreshToken");

            toast({
                title: "Account Deleted",
                description: "Your account has been permanently deleted",
                variant: "default",
            });

            // Redirect to home page
            router.replace("/");
            setTimeout(() => {
                if (window.location.pathname !== "/") {
                    window.location.href = "/";
                }
            }, 100);
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to delete account",
                variant: "destructive",
            });
        },
    });

    const handleDelete = () => {
        if (confirmText !== "DELETE") {
            toast({
                title: "Error",
                description: 'Please type "DELETE" to confirm',
                variant: "destructive",
            });
            return;
        }

        // We need the user ID - you might need to adjust this based on your API
        // For now, using a placeholder - update based on your user object structure
        const userId = (user as any)?._id || (user as any)?.id;

        if (!userId) {
            toast({
                title: "Error",
                description: "User ID not found",
                variant: "destructive",
            });
            return;
        }

        mutate(userId);
    };

    const handleClose = () => {
        setConfirmText("");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <DialogTitle className="text-red-600 dark:text-red-400">Delete Account</DialogTitle>
                    </div>
                    <DialogDescription className="text-left space-y-2">
                        <p className="font-semibold text-red-600 dark:text-red-400">
                            This action cannot be undone!
                        </p>
                        <p>
                            This will permanently delete your account and remove all your data from our servers.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>All your sessions will be terminated</li>
                            <li>Your profile information will be deleted</li>
                            <li>You will lose access to all features</li>
                            <li>This action is irreversible</li>
                        </ul>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmText" className="text-red-600 dark:text-red-400">
                            Type <span className="font-bold">DELETE</span> to confirm
                        </Label>
                        <Input
                            id="confirmText"
                            type="text"
                            placeholder="Type DELETE"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="border-red-300 dark:border-red-800 focus:border-red-500"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={isPending || confirmText !== "DELETE"}
                        className="bg-red-600 hover:bg-red-700 !text-white"
                    >
                        {isPending && <Loader className="animate-spin mr-2" size={16} />}
                        Delete Account
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteAccountDialog;
