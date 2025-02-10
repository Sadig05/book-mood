import { useLocation } from "@tanstack/react-router";
import { items as menuItems } from "@/constants/paths";

export function useBreadcrumbs() {
  const location = useLocation();
  
  // Generate breadcrumb paths from URL
  const paths = location.pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, array) => {
      const url = `/${array.slice(0, index + 1).join("/")}`;
      const menuItem = menuItems.find(item => item.url === url);
      return { title: menuItem ? menuItem.title : path, link: url };
    });
  
  return paths;
}
