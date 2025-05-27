import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import NavbarItem from "@/components/navbar/navbar_item";
import { selectAdminRole } from "@/redux/admin/adminSelector";
import {
  fetchAppBanners,
  postAppBanners,
  deleteAppBanner,
  fetchProducts,
} from "../helper";
import AddBanner from "./components/AddBanner";
import PreviewBanner from "./components/PreviewBanner";
import BannerList from "./components/BannerList";

const AppBanners = () => {
  // Local state
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Refs for infinite scrolling
  const observerRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Configuration
  const breadcrumbs = [{ title: "App Banners", isNavigation: false }];
  const sensors = useSensors(useSensor(PointerSensor));
  const role = useSelector(selectAdminRole);
  const queryClient = useQueryClient();

  // Base parameters for product fetching
  const baseParams = {
    per_page: 10,
    search: "",
  };

  // Infinite query for products with pagination
  const {
    data: productPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error: productsError,
  } = useInfiniteQuery({
    queryKey: ["products", role],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching products page:", pageParam);
      return fetchProducts({
        params: { ...baseParams, page: pageParam },
        role,
      });
    },
    getNextPageParam: (lastPage, pages) => {
      const currentPage = pages.length;
      const totalItems = lastPage.response?.data?.total || 0;
      const loadedItems = pages.reduce(
        (sum, page) => sum + (page.response?.data?.data?.length || 0), 
        0
      );
      
      console.log(`Page ${currentPage}: loaded ${loadedItems}/${totalItems} items`);
      return loadedItems < totalItems ? currentPage + 1 : undefined;
    },
    // Flatten all pages into single array
    select: (data) => data.pages.map((page) => page.response.data.data).flat(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Get flattened products array
  const products = productPages ?? [];

  // Simple query for banners
  const { data: banners = [] } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchAppBanners,
    select: (data) => data.response?.data[0].banner,
  });

  // Handle file selection (validation only)
  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG or WEBP files are allowed.");
      event.target.value = ""; // Reset file input
      return;
    }

    // Store file data for later upload
    setFormData({
      file,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file)
    });
  };

  // Handle banner upload when Add Banner button is clicked
  const handleAddBanner = async (productId) => {
    console.log("productId", productId);
    if (!formData.file || !productId) {
      toast.error("Please select both a product and a file.");
      return;
    }

    // Prepare form data
    const payload = new FormData();
    payload.append("name", formData.fileName);
    payload.append("file", formData.file);
    payload.append("product", productId);

    setLoading(true);
    try {
      await postAppBanners({ data: payload });
      toast.success("Banner uploaded successfully!");
      queryClient.invalidateQueries(["banners"]);
      
      // Reset form data
      setFormData({});
      if (formData.fileUrl) {
        URL.revokeObjectURL(formData.fileUrl);
      }
    } catch (error) {
      toast.error(`Upload failed: ${error?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle banner deletion
  const handleDeleteBanner = async (id, index) => {
    try {
      await deleteAppBanner({ id });
      queryClient.invalidateQueries(["banners"]);
      toast.success("Banner deleted successfully!");
    } catch (error) {
      toast.error(`Deletion failed: ${error?.message || "Unknown error"}`);
    }
  };

  // Handle drag and drop reordering
  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = config.findIndex((item) => item._id === active.id);
      const newIndex = config.findIndex((item) => item._id === over.id);
      setConfig((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // Handle products loading error
  useEffect(() => {
    if (productsError) {
      toast.error(`Failed to load products: ${productsError.message}`);
    }
  }, [productsError]);

  return (
    <>
      <NavbarItem title="App Banners" breadcrumbs={breadcrumbs} />
      <div className="p-6 w-full mx-auto">
        <div className="flex gap-6 mb-8">
          <BannerList
            config={banners}
            products={products}
            sensors={sensors}
            onDragEnd={onDragEnd}
            handleDeleteBanner={handleDeleteBanner}
            handleFileSelection={handleFileSelection}
            handleAddBanner={handleAddBanner}
            formData={formData}
            loading={loading}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            observerRef={observerRef}
            dropdownRef={dropdownRef}
          />
        </div>
        <PreviewBanner config={banners} />
      </div>
    </>
  );
};

export default AppBanners;