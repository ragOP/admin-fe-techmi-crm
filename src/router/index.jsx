import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/layout";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import ErrorPage from "@/components/errors/404";
import Services from "@/pages/services";
import Products from "@/pages/products";
import Categories from "@/pages/categories";
import ServicesEditor from "@/pages/services/pages/services_editor";
import ProtectedRoute from "@/auth/ProtectedRoute";
import PublicRoute from "@/auth/PublicRoute";
import Admins from "@/pages/admin";
import { getItem, removeItem } from "@/utils/local_storage";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import AdminEditor from "@/pages/admin/pages/admin_editor";
import { clearCredentials } from "@/redux/admin/adminSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectAdmin } from "@/redux/admin/adminSelector";
import ServiceDetails from "@/pages/services/pages/service_details";
import CategoriesEditor from "@/pages/categories/pages/categories_editor";
import ProductsEditor from "@/pages/products/pages/products_editor";
import Users from "@/pages/users";

const Router = () => {
  const dispatch = useDispatch();

  console.log(useSelector(selectAdmin))

  const checkTokenExpiration = () => {
    const storedToken = getItem("token");
    if (!storedToken) return;

    try {
      const decodedToken = jwtDecode(storedToken);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        removeItem("token");
        dispatch(clearCredentials());
        toast.error("Your session has expired. Please login again.", {
          autoClose: 3000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      removeItem("token");
    }
  };

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          // <ProtectedRoute>
          <Layout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="admins" element={<Admins />} />
        <Route path="admins/add" element={<AdminEditor />} />

        {/* Services Routes */}
        <Route path="services" element={<Services />} />
        <Route path="services/add" element={<ServicesEditor />} />
        <Route path="services/edit/:id" element={<ServicesEditor />} />
        <Route path="services/:id" element={<ServiceDetails />} />

        {/* Products Routes */}
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<ProductsEditor />} />
        <Route path="products/edit/:id" element={<ProductsEditor />} />
        {/* <Route path="products/:id" element={<ProductDetails />} /> */}

        {/* Categories Routes */}
        <Route path="categories" element={<Categories />} />
        <Route path="categories/add" element={<CategoriesEditor />} />
        <Route path="categories/edit/:id" element={<CategoriesEditor />} />
        {/* <Route path="categories/:id" element={<CategoryDetails />} /> */}

        <Route path="users" element={<Users />} />

      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
