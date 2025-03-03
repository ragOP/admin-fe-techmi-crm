import * as React from "react";
import {
  BellIcon,
  Briefcase,
  ContactIcon,
  Crown,
  FileText,
  FormInput,
  Layers,
  LayoutDashboard,
  Package,
  Settings2,
  ShieldUserIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { NavProjects } from "./nav-projects";

const data = {
  user: {
    name: "Kashif Deshmukh",
    email: "kd@example.com",
    avatar: "/user.jpg",
  },
  teams: [
    {
      name: "CRM",
      logo: Crown,
      plan: "Super Admin",
    },
    {
      name: "CRM",
      logo: ShieldUserIcon,
      plan: "Admin",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: Briefcase,
      isActive: true,
      items: [],
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Layers,
      items: [],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
      items: [],
    },
  ],
  projects: [
    {
      title: "Forms",
      name: "Forms",
      url: "/forms",
      icon: FormInput,
      items: [
        {
          title: "Service",
          url: "/forms/service",
        },
        {
          title: "Product",
          url: "/forms/product",
        },
      ]
    },
    {
      title: "Blogs",
      name: "Blogs",
      url: "/blogs",
      icon: FileText,
    },
    {
      title: "Contact us form",
      name: "Contact us form",
      url: "/contact-us",
      icon: ContactIcon,
    },
  ],
  extra: [
    {
      title: "Forms",
      name: "Forms",
      url: "/forms",
      icon: FormInput,
    },
  ],
  more: [
    {
      title: "Notifications",
      name: "Notifications",
      url: "/notifications",
      icon: BellIcon,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <Input placeholder="Search" className="bg-white" />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <NavMain items={data.navMain} showHeader={false} />
        <NavMain items={data.projects} showHeader={true} header={"More"} />
        <NavProjects projects={data.extra} />
      </SidebarContent>
      <SidebarFooter>
        <NavMain items={data.more} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
