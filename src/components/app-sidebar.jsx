import * as React from "react";
import { Briefcase, Package } from "lucide-react";

import { NavMain } from "@/components/nav-main";
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
import { useLocation } from "react-router";

export function AppSidebar({ ...props }) {
  const location = useLocation();

  const role = useSelector(selectAdminRole);
  const name = useSelector(selectAdminName);
  const email = useSelector(selectAdminEmail);

  const filteredNavMain = filterItemsByRole(data.navMain, role);
  const filteredProjects = filterItemsByRole(data.projects, role);
  const filteredMore = filterItemsByRole(data.more, role);

  const [search, setSearch] = React.useState("");

  const { data: services } = useQuery({
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

  const filterBySearch = (items) =>
    items
      .map((item) => {
        if (item.items && Array.isArray(item.items)) {
          const filteredSub = filterBySearch(item.items);
          if (
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            filteredSub.length > 0
          ) {
            return { ...item, items: filteredSub };
          }
          return null;
        }
        if (item.title.toLowerCase().includes(search.toLowerCase())) {
          return item;
        }
        return null;
      })
      .filter(Boolean);

  // Only show sections if they have items after filtering
  const navMainFiltered = filterBySearch(filteredNavMain);
  const projectsFiltered = filterBySearch(filteredProjects);
  const orderManagementFiltered = filterBySearch(orderManagement);
  const moreFiltered = filterBySearch(filteredMore);

  const pathname = location.pathname;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} role={role} />
        <Input
          placeholder="Search"
          className="bg-white dark:bg-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {navMainFiltered.length > 0 && (
          <NavMain
            items={navMainFiltered}
            showHeader={false}
            pathname={pathname}
          />
        )}
        {projectsFiltered.length > 0 && (
          <NavMain
            items={projectsFiltered}
            showHeader={true}
            header={"More"}
            pathname={pathname}
          />
        )}
        {orderManagementFiltered.length > 0 && (
          <NavMain
            items={orderManagementFiltered}
            showHeader={true}
            header={"Management"}
            pathname={pathname}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        {moreFiltered.length > 0 && (
          <NavMain items={moreFiltered} pathname={pathname} />
        )}
        <NavUser user={userInfo} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
