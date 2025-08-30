"use client";
import React, { useCallback, useState } from "react";
import { Button } from "@/app/components/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableMFAMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/form";
import { Input } from "@/app/components/input";

const formSchema = z.object({
  password: z.string().trim().min(1, {
    message: "Password is required",
  }),
});

const RevokeMfa = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: disableMFAMutationFn,
    onSuccess: (response) => {
      const message = response.data?.message || "MFA disabled successfully";
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast({
        title: "Success",
        description: message,
      });
      setIsOpen(false);
      form.reset();
    },
    onError: (error: { message: string; response?: { data?: { message: string } } }) => {
      const errorMessage = error.response?.data?.message || error.message;
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    mutate({ password: values.password });
  }, [mutate]);

  return (
    <>
      <Button
        className="h-[35px] !text-[#c40006d3] !bg-red-100 shadow-none mr-1"
        onClick={() => setIsOpen(true)}
      >
        Revoke Access
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Multi-Factor Authentication</DialogTitle>
            <DialogDescription>
              Disabling MFA will reduce the security of your account. Please confirm by entering your password.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isPending}
                  className="ml-2"
                >
                  {isPending && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                  Disable MFA
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RevokeMfa;
