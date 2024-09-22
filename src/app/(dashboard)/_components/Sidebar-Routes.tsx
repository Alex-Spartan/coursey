"use client"
import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "./sidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const sidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherRoute = pathname?.startsWith("/teacher");
  const routes = isTeacherRoute ? teacherRoutes : guestRoutes;

  return (
  <div className="flex flex-col w-full">
    {routes.map((route, index) => (
      <SidebarItem
        key={index}
        icon={route.icon}
        label={route.label}
        href={route.href}
      />
    ))
  }
  </div>
);
};
export default sidebarRoutes;
