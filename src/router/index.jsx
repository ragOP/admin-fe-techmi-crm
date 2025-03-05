import React from "react";
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

const Router = () => {
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

        {/* Services Routes */}
        <Route path="services" element={<Services />} />
        <Route path="services/add" element={<ServicesEditor />} />
        {/* <Route path="services/:id" element={<ServiceDetails />} /> */}

        {/* Products Routes */}
        <Route path="products" element={<Products />} />
        {/* <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetails />} /> */}

        {/* Categories Routes */}
        <Route path="categories" element={<Categories />} />
        {/* <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/:id" element={<CategoryDetails />} /> */}
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
