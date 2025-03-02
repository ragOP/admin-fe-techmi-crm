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

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
