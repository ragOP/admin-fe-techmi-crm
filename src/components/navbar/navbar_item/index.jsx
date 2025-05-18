import ModeToggle from "@/components/toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { useNavigate } from "react-router";

const NavbarItem = ({ title, customBox, breadcrumbs = [] }) => {
  return (
    <div className="flex md:flex-row justify-between md:items-center p-4">
      <div className="flex flex-row mb-4 md:mb-0 gap-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-xl font-semibold">{title}</h1>
          <NavbarBreadcrumb title={title} breadcrumbs={breadcrumbs} />
        </div>
      </div>

      <div className="flex flex-row items-center gap-4">
        {customBox && customBox}
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavbarItem;

export const NavbarBreadcrumb = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();

  const onNavigateToDashboard = () => {
    navigate("/dashboard");
  }
  return (
    <header className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-6">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={onNavigateToDashboard}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {/* <BreadcrumbSeparator className="hidden md:block" /> */}

            {breadcrumbs.map((item) => (
              <React.Fragment key={item.navigate || item.title}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={item.navigate}>
                    {item.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
            {/* <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem> */}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
