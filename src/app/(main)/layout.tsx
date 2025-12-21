import { SidebarProvider, SidebarInset } from "@/app/components/sidebar";
import Asidebar from "./components/Asidebar";
import Header from "./components/Header";
import { AuthProvider } from "@/context/auth-provider";
import { ThemeToggle } from "@/app/components/theme-toggle";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Asidebar />
        <SidebarInset>
          <main className="w-full">
            <Header />
            {children}
          </main>
        </SidebarInset>
        <ThemeToggle />
      </SidebarProvider>
    </AuthProvider>
  );
}
