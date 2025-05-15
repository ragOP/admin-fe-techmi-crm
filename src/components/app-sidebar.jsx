import * as React from "react";
import {
  Briefcase,
  Package,
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
// import { NavProjects } from "./nav-projects";
import { useSelector } from "react-redux";
import {
  selectAdminEmail,
  selectAdminName,
  selectAdminRole,
} from "@/redux/admin/adminSelector";
import { filterItemsByRole } from "@/utils/sidebar/filterItemsByRole";
import { data } from "@/utils/sidebar/sidebarData";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/pages/services/helpers/fetchServices";

export function AppSidebar({ ...props }) {
  const role = useSelector(selectAdminRole);
  const name = useSelector(selectAdminName);
  const email = useSelector(selectAdminEmail);

  const filteredNavMain = filterItemsByRole(data.navMain, role);
  const filteredProjects = filterItemsByRole(data.projects, role);
  // const filteredExtra = filterItemsByRole(data.extra, role);
  const filteredMore = filterItemsByRole(data.more, role);

  const {
    data: services,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  const orderManagement = [
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: Package,
      isActive: true,
      items: services?.map((service) => ({
        title: service.name,
        url: `/dashboard/orders/${service._id}`,
        icon: Briefcase,
        isActive: true,
        roles: ["super_admin"],
      })),
      roles: ["super_admin"],
    },
  ];

  const userInfo = {
    name: name,
    email: email,
    avatar: "/user.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} role={role} />
        <Input placeholder="Search" className="bg-white" />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
        <NavMain items={filteredNavMain} showHeader={false} />
        <NavMain items={filteredProjects} showHeader={true} header={"More"} />
        <NavMain
          items={orderManagement}
          showHeader={true}
          header={"Management"}
        />
        {/* <NavProjects projects={filteredExtra} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavMain items={filteredMore} />
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
