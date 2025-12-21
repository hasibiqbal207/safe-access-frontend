"use client";
import React, { useState } from "react";
import {
  Home,
  Loader,
  Lock,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/app/components/sidebar";
import { useAuthContext } from "@/context/auth-provider";
import LogoutDialog from "@/app/(main)/components/LogoutDialog";

const Asidebar = () => {
  const { isLoading } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  const { open } = useSidebar();
  const items = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "MFA",
      url: "/mfa",
      icon: Shield,
    },
    {
      title: "Sessions",
      url: "/sessions",
      icon: Lock,
    },
    {
      title: "Account",
      url: "#",
      icon: User,
    },

    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="!pt-0 dark:bg-background">
          <div className="flex h-[60px] items-center">
            {open && (
              <Link
                href="/home"
                className="hidden md:flex ml-2 text-xl tracking-[-0.16px] text-black dark:text-[#fcfdffef] font-bold mb-0"
              >
                Safe Access
              </Link>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent className="dark:bg-background">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} className="!text-[15px]">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="dark:bg-background">
          <SidebarMenu>
            <SidebarMenuItem>
              {isLoading ? (
                <Loader
                  size="24px"
                  className="place-self-center self-center animate-spin"
                />
              ) : (
                <SidebarMenuButton
                  onClick={() => setIsOpen(true)}
                  className="!text-[15px]"
                >
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <LogoutDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Asidebar;
