import { User2, ChevronsUpDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { items } from "@/constants/paths";
import BookMoodLogo from '../assets/bookmood.png';
import BMLogo from '../assets/bm.png';
import { useAuth } from "@/api/queries/authQueries";
import { signOut } from "@/utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";


export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { LogoutMutation } = useAuth();
  const { mutate: logout, isLoading: logoutLoading } = LogoutMutation;
  console.log(location, "location");

  // Handler for sign out using the logout mutation
  const handleSignOut = () => {
    logout(undefined, {
      onSuccess: () => {
        // Navigate to the login page after successful logout
        navigate({ to: "/login" });
      },
      onError: (error) => {
        // Log or show an error notification if desired
        if (error instanceof Error) {
          console.error("Logout error:", error.message);
        } else {
          console.error("Logout error:", error);
        }
        // Proceed to sign out on the UI even if the API call fails

        signOut();
        navigate({ to: "/login" });
      },
    });
  };
  
  const currentUser = useSelector((state: RootState) => state.user);
  // If the user is logged in, currentUser.name should contain their username.
  const username = currentUser?.username || "Username";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center">
        {open ? (
          <img src={BookMoodLogo} alt="Sadiq Logo" className="w-52 h-12 object-cover" />
        ) : (
          <img src={BMLogo} alt="SL Logo" className="min-w-16 min-h-8 object-cover h-auto w-auto" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location?.pathname === item?.url}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {username}
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
            
                <DropdownMenuItem onClick={handleSignOut} disabled={logoutLoading}>
                  <span>{logoutLoading ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
