export const isDev = () => {
  return import.meta.env.MODE === "development";
};

export const BACKEND_URL = !isDev()
  ? "http://localhost:8000"
  : "https://393d-84-247-129-99.ngrok-free.app";

export const endpoints = {
  // Admin
  admin: "api/auth/admin",
  login: "api/auth/admin/login",
  admin_register: "api/auth/admin/register",
  admin_update: "api/auth/admin/update",

  // Sub Admin
  sub_admin: "api/auth/admin/sub-admin",

  // User
  user: "api/auth/user",

  register: "api/auth/register",
  users: "api/auth/user",
  signup: "api/auth/register",
  product: "api/product",
  category: "api/category",
  service: "api/service",
  cart: "api/cart",
  product_by_id: "api/product",

  // Order
  order: "api/order",

  // Bulk Upload
  bulk_upload: "api/product/batch",

  // blogs
  blogs: "api/blog",

  // contacts
  contact: "api/contact",

  header: "api/header",
  home: "api/home",
  internal: "api/internal",
  service_page: "api/service-page",
  app_banners: "api/app-banner",

  // coupons
  coupons: "api/coupon",
  allCoupons: "api/coupon/all/admin",

  // dashboard
  dashboard: "api/dashboard",

  // brands
  brands: "api/brand",

  // Medicine type
  medicine_type: "api/medicine-type",

  // Hsn Codes
  hsn_codes: "api/hsn-codes",
};
