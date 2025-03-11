import * as React from "react";
import {
  BellIcon,
  Briefcase,
  CircleUserIcon,
  ContactIcon,
  Crown,
  FileText,
  FormInput,
  Layers,
  LayoutDashboard,
  Package,
  Settings2,
  ShieldUserIcon,
  Users,
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
import { useSelector } from "react-redux";
import {
  selectAdminEmail,
  selectAdminName,
  selectAdminRole,
} from "@/redux/admin/adminSelector";
import { filterItemsByRole } from "@/utils/sidebar/filterItemsByRole";
import { data } from "@/utils/sidebar/sidebarData";

export function AppSidebar({ ...props }) {
  // const isSuperAdmin = useSelector(selectIsSuperAdmin);
  // const role = isSuperAdmin ? "super_admin" : "admin";
  const role = useSelector(selectAdminRole)
  const name = useSelector(selectAdminName);
  const email = useSelector(selectAdminEmail);

  const filteredNavMain = filterItemsByRole(data.navMain, role);
  const filteredProjects = filterItemsByRole(data.projects, role);
  const filteredExtra = filterItemsByRole(data.extra, role);
  const filteredMore = filterItemsByRole(data.more, role);

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
        <NavProjects projects={filteredExtra} />
      </SidebarContent>
      <SidebarFooter>
        <NavMain items={filteredMore} />
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
