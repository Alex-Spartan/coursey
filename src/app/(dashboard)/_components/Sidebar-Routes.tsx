"use client"
import { Compass, Layout } from "lucide-react";
import SidebarItem from "./sidebarItem";

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

const sidebarRoutes = () => {
  const routes = guestRoutes;

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
