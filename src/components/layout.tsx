import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppBreadcrumb } from "@/components/app-breadcrumb";
import { Separator } from "@/components/ui/separator";
import { getSidebarState, saveSidebarState } from "@/utils/functions";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(getSidebarState());
  const navigate = useNavigate();
  const location = useLocation();

  // Update localStorage whenever the sidebar state changes
  useEffect(() => {
    saveSidebarState(isOpen);
  }, [isOpen]);

  // Listen for changes to the authentication flag in localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "isAuthenticated" && event.newValue !== "true") {
        // Navigate to the login page if not authenticated
        navigate({ to: "/login" });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  // Check if current route is one that should NOT display the sidebar/header
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/signup";

  if (hideLayout) {
    // For login/signup pages, render only the outlet without sidebar and header.
    return <Outlet>{children}</Outlet>;
  }

  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <AppSidebar />
      <SidebarInset className="h-screen ">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumb />
          </div>
        </header>
        <div className="h-full p-4 md:px-8 !overflow-hidden">
          <Outlet>{children}</Outlet>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
