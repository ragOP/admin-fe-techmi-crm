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
  User,
  Users,
  Users2,
} from "lucide-react";

export const data = {
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
      roles: ["super_admin", "admin"],
    },
    {
      title: "Admins",
      url: "/dashboard/admins",
      icon: Users,
      isActive: true,
      items: [],
      roles: ["super_admin"],
    },
    {
      title: "Sub Admins",
      url: "/dashboard/sub-admins",
      icon: Users2,
      isActive: true,
      items: [],
      roles: ["admin"],
    },
    {
      title: "Services",
      url: "/dashboard/services",
      icon: Briefcase,
      isActive: true,
      items: [],
      roles: ["super_admin"],
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Layers,
      items: [],
      roles: ["super_admin", "admin"],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
      items: [],
      roles: ["super_admin", "admin"],
    },
  ],
  projects: [
    {
      title: "Users",
      url: "/dashboard/users",
      icon: User,
      isActive: true,
      items: [],
      roles: ["super_admin"],
    },
    {
      title: "Congifuration",
      name: "Configuration",
      url: "/config",
      icon: FormInput,
      items: [
        {
          title: "Home",
          url: "config/home",
        },
        {
          title: "Service",
          url: "config/service",
        },
        {
          title: "Header & Footer",
          url: "config/header",
        },
        {
          title: "Internal Pages",
          url: "config/internal",
        },
      ],
      roles: ["super_admin"],
    },
    {
      title: "Blogs",
      name: "Blogs",
      url: "/blogs",
      icon: FileText,
      roles: ["super_admin", "admin"],
    },
    {
      title: "Contact us form",
      name: "Contact us form",
      url: "/contact-us",
      icon: ContactIcon,
      roles: ["super_admin", "admin"],
    },
  ],
  extra: [
    {
      title: "Forms",
      name: "Forms",
      url: "/forms",
      icon: FormInput,
      roles: ["super_admin", "admin"],
    },
  ],
  more: [
    {
      title: "Notifications",
      name: "Notifications",
      url: "/notifications",
      icon: BellIcon,
      roles: ["super_admin", "admin"],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [],
      roles: ["super_admin", "admin"],
    },
  ],
};
