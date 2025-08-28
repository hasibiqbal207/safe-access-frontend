import { Button } from "@/app/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/dialog";
import { toast } from "@/hooks/use-toast";
import { logoutMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { deleteCookie } from "cookies-next";

const LogoutDialog = (props: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isOpen, setIsOpen } = props;

  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      
      router.replace("/");
      
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 100);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = useCallback(() => {
    mutate();
  }, [mutate]);
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
            <DialogDescription>
              This will end your current session and you will need to log in
              again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isPending}
              type="button"
              className="!text-white"
              onClick={handleLogout}
            >
              {isPending && <Loader className="animate-spin" />}
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LogoutDialog;
