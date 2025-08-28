import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import QueryProvider from "@/context/query-provider";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Safe Access",
  description: "Safe Access is a platform for managing access to your data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background ${dm_sans.className} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
