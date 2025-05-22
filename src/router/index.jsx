import React, { useEffect, lazy, Suspense } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { getItem, removeItem } from "@/utils/local_storage";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { clearCredentials } from "@/redux/admin/adminSlice";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react";

// Lazy imports
const Layout = lazy(() => import("@/layout"));
const Login = lazy(() => import("@/pages/login"));
const Signup = lazy(() => import("@/pages/signup"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ErrorPage = lazy(() => import("@/components/errors/404"));
const Services = lazy(() => import("@/pages/services"));
const Products = lazy(() => import("@/pages/products"));
const Categories = lazy(() => import("@/pages/categories"));
const ForgetPassword = lazy(() => import("@/pages/forget_password"));
const ResetPassword = lazy(() => import("@/pages/reset_password"));
const ServicesEditor = lazy(() =>
  import("@/pages/services/pages/services_editor")
);
const Admins = lazy(() => import("@/pages/admin"));
const AdminEditor = lazy(() => import("@/pages/admin/pages/admin_editor"));
const ServiceDetails = lazy(() =>
  import("@/pages/services/pages/service_details")
);
const CategoriesEditor = lazy(() =>
  import("@/pages/categories/pages/categories_editor")
);
const ProductsEditor = lazy(() =>
  import("@/pages/products/pages/products_editor")
);
const Users = lazy(() => import("@/pages/users"));
const HomeConfig = lazy(() => import("@/pages/configurables/home"));
const ServiceConfig = lazy(() => import("@/pages/configurables/service"));
const HeaderConfig = lazy(() => import("@/pages/configurables/header"));
const InternalConfig = lazy(() =>
  import("@/pages/configurables/internal_pages")
);
const AppBanners = lazy(() => import("@/pages/configurables/app_banners"));
const SubAdmins = lazy(() => import("@/pages/sub_admins"));
const SubAdminEditor = lazy(() =>
  import("@/pages/sub_admins/pages/sub_admin_editor")
);
const UserEditor = lazy(() => import("@/pages/users/pages/user_editor"));
const Orders = lazy(() => import("@/pages/orders"));
const Blogs = lazy(() => import("@/pages/blogs"));
const ContactUs = lazy(() => import("@/pages/contact_us"));
const BlogsEditor = lazy(() => import("@/pages/blogs/pages/blogs_editor"));
const BlogsDetails = lazy(() => import("@/pages/blogs/pages/blogs_details"));
const Coupons = lazy(() => import("@/pages/coupons"));
const CouponEditor = lazy(() => import("@/pages/coupons/pages/coupon_editor"));
const ProductDetails = lazy(() =>
  import("@/pages/products/pages/product_details")
);
const Brands = lazy(() => import("@/pages/brand"));
const BrandEditor = lazy(() => import("@/pages/brand/pages/brand_editor"));
const MedicineType = lazy(() => import("@/pages/medicine_type"));
const MedicineTypeEditor = lazy(() =>
  import("@/pages/medicine_type/pages/medicine_type_editor")
);
const OrderDetails = lazy(() => import("@/pages/orders/pages/order_details"));
const HsnCodes = lazy(() => import("@/pages/hsn_codes"));
const HsnCodesEditor = lazy(() =>
  import("@/pages/hsn_codes/pages/hsn_codes_editor")
);


const Router = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkTokenExpiration = () => {
    const publicRoutes = ['/login', '/signup', '/forgot-password'];
    const publicPathPrefixes = ['/reset-password/'];
    
    if (publicRoutes.includes(window.location.pathname)) {
      return;
    }

    // Check routes with dynamic parameters
    if (publicPathPrefixes.some(prefix => window.location.pathname.startsWith(prefix))) {
      return;
    }

    const storedToken = getItem("token");

    if (!storedToken) {
      navigate("/login");
      return;
    }

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
    <Suspense
      fallback={
        <div className="w-full h-screen flex items-center justify-center text-lg">
          <Loader2 className="animate-spin w-10 h-10 text-primary" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />

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
          <Route path="admins/edit/:id" element={<AdminEditor />} />

          <Route path="sub-admins" element={<SubAdmins />} />
          <Route path="sub-admins/add" element={<SubAdminEditor />} />

          {/* Services Routes */}
          <Route path="services" element={<Services />} />
          <Route path="services/add" element={<ServicesEditor />} />
          <Route path="services/edit/:id" element={<ServicesEditor />} />
          <Route path="services/:id" element={<ServiceDetails />} />

          {/* Products Routes */}
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<ProductsEditor />} />
          <Route path="products/edit/:id" element={<ProductsEditor />} />
          <Route path="products/:id" element={<ProductDetails />} />

          {/* Categories Routes */}
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<CategoriesEditor />} />
          <Route path="categories/edit/:id" element={<CategoriesEditor />} />

          <Route path="orders/:serviceId" element={<Orders />} />
          <Route path="orders/details/:id" element={<OrderDetails />} />

          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<UserEditor />} />
          <Route path="users/edit/:id" element={<UserEditor />} />

          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/add" element={<BlogsEditor />} />
          <Route path="blogs/edit/:id" element={<BlogsEditor />} />
          <Route path="blogs/:id" element={<BlogsDetails />} />

          <Route path="coupons" element={<Coupons />} />
          <Route path="coupons/:add" element={<CouponEditor />} />
          <Route path="coupons/edit/:id" element={<CouponEditor />} />

          {/* <Route path="coupons/add" element={<Coupons />} /> */}

          <Route path="contact-us" element={<ContactUs />} />

          <Route path="brands" element={<Brands />} />
          <Route path="brands/add" element={<BrandEditor />} />
          <Route path="brands/edit/:id" element={<BrandEditor />} />

          <Route path="medicine-type" element={<MedicineType />} />
          <Route path="medicine-type/add" element={<MedicineTypeEditor />} />
          <Route
            path="medicine-type/edit/:id"
            element={<MedicineTypeEditor />}
          />

          <Route path="hsn-codes" element={<HsnCodes />} />
          <Route path="hsn-codes/add" element={<HsnCodesEditor />} />
          <Route path="hsn-codes/edit/:id" element={<HsnCodesEditor />} />

          <Route path="configuration/home" element={<HomeConfig />} />
          <Route path="configuration/service" element={<ServiceConfig />} />
          <Route path="configuration/header" element={<HeaderConfig />} />
          <Route path="configuration/internal" element={<InternalConfig />} />
          <Route path="configuration/app-banners" element={<AppBanners />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
