import { SidebarProvider, SidebarInset } from "@/app/components/sidebar";
import Asidebar from "./components/Asidebar";
import Header from "./components/Header";
import { AuthProvider } from "@/context/auth-provider";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { AuthGuard } from "./components/AuthGuard";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AuthGuard>
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
      </AuthGuard>
    </AuthProvider>
  );
}
