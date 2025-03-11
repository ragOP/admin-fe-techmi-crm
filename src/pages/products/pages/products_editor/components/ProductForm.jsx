import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectAdminId } from "@/redux/admin/adminSelector";
import { updateProduct } from "../helper/updateProduct";
import { createProduct } from "../helper/createProduct";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/file/urlToFile";
import { X } from "lucide-react";
import { productsFormSchema } from "../schema/productFormSchema";
import Select from "react-select";
import { fetchCategories } from "@/pages/categories/helpers/fetchCategories";

const ProductsForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const reduxAdminId = useSelector(selectAdminId);
  const [images, setImages] = useState([]);
  const [bannerImage, setBannerImage] = useState();

  // Fetch categories
  const { data: categoryData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Format categories for react-select
  const categoryOptions =
    categoryData?.categories && categoryData.categories.length > 0
      ? categoryData.categories.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }))
      : [];

  const form = useForm({
    resolver: zodResolver(productsFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      small_description: initialData?.small_description || "",
      full_description: initialData?.full_description || "",
      price: initialData?.price || 0,
      discounted_price: initialData?.discounted_price || 0,
      dnd_discounted_price: initialData?.dnd_discounted_price || 0,
      salesperson_discounted_price:
        initialData?.salesperson_discounted_price || 0,
      instock: initialData?.instock || true,
      manufacturer: initialData?.manufacturer || "",
      consumed_type: initialData?.consumed_type || "",
      expiry_date: initialData?.expiry_date || "",
      images: [],
      banner_image: "",
      uploaded_by_brand: initialData?.uploaded_by_brand || "",
      is_best_seller: initialData?.is_best_seller || false,
      category: initialData?.category || [],
    },
  });

  useEffect(() => {
    const convertUrlsToFiles = async () => {
      if (isEditMode && initialData?.images) {
        const files = await Promise.all(
          initialData.images.map(
            async (url, index) => await urlToFile(url, `file_${index}.jpg`)
          )
        );
        const validFiles = files.filter((file) => file !== null);
        form.setValue("images", validFiles);
      }

      if (isEditMode && initialData?.banner_image) {
        const bannerFile = await urlToFile(
          initialData.banner_image,
          "banner.jpg"
        );
        if (bannerFile) {
          form.setValue("banner_image", bannerFile);
        }
      }
    };

    convertUrlsToFiles();
  }, [isEditMode, initialData, form]);

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Product created successfully.");
        form.reset();
        navigate("/dashboard/products");
      } else {
        toast.error("Failed to create product. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create product. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateProduct({ id, payload: data }),
    onSuccess: (res) => {
      if (res?.response?.success) {
        toast.success("Product updated successfully.");
        navigate("/dashboard/products");
      } else {
        toast.error("Failed to update product. Please try again.");
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update product. Please try again.");
    },
  });

  const onSubmit = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      console.log(key, value)
      if (key === "category") {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((cat) => formData.append("category", cat));
        } else {
          formData.append("category", "[]");
        }
      } else if (key === "images") {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((file) => formData.append("images", file));
        }
      } else if (key === "banner_image") {
        if (value) {
          formData.append("banner_image", value);
        }
      } else {
        formData.append(key, value);
      }
    });

    formData.append("created_by_admin", reduxAdminId);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Name Field */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Small Description Field */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="small_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Small Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter small description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Full Description Field */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="full_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Price Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter product price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Discounted Price Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="discounted_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discounted Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discounted price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="dnd_discounted_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DND Discounted Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discounted price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3">
            <FormField
              control={form.control}
              name="salesperson_discounted_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salesperson Discounted Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter discounted price"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* In Stock Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="instock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>In Stock</FormLabel>
                  <FormControl>
                    <Select
                      options={[
                        { value: true, label: "In Stock" },
                        { value: false, label: "Out of Stock" },
                      ]}
                      value={
                        field.value
                          ? { value: true, label: "In Stock" }
                          : { value: false, label: "Out of Stock" }
                      }
                      onChange={(selected) => field.onChange(selected.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Manufacturer Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter manufacturer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Consumed Type Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="consumed_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumed Type</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter consumed type" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Expiry Date Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Category Field */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      isMulti
                      options={categoryOptions}
                      value={categoryOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selected) => {
                        field.onChange(
                          selected ? selected.map((cat) => cat.value) : []
                        );
                      }}
                      placeholder="Select categories"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images Field */}
          {/* <div className="col-span-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImages((prev) => [...prev, ...files]);
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          {/* Banner Image Field */}
          {/* <div className="col-span-6">
            <FormField
              control={form.control}
              name="banner_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const currentImages = field.value || [];
                          const updatedImages = [...currentImages, ...files];
                          field.onChange(updatedImages);
                        }}
                      />
                      {/* Display selected images */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {field.value?.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={
                                file instanceof File
                                  ? URL.createObjectURL(file)
                                  : file
                              }
                              alt={`Preview ${index}`}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedImages = field.value.filter(
                                  (_, i) => i !== index
                                );
                                field.onChange(updatedImages);
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Banner Image Field */}
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="banner_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                      {/* Display selected banner image */}
                      {field.value && (
                        <div className="mt-4 relative">
                          <img
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt="Banner Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Uploaded by Brand Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="uploaded_by_brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uploaded by Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Is Best Seller Field */}
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="is_best_seller"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Best Seller</FormLabel>
                  <FormControl>
                    <Select
                      options={[
                        { value: true, label: "Yes" },
                        { value: false, label: "No" },
                      ]}
                      value={
                        field.value
                          ? { value: true, label: "Yes" }
                          : { value: false, label: "No" }
                      }
                      onChange={(selected) => {
                        console.log("selected", selected);
                        field.onChange(selected.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-6">
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductsForm;
