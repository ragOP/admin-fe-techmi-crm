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
import { selectAdminId, selectAdminRole } from "@/redux/admin/adminSelector";
import { updateProduct } from "../helper/updateProduct";
import { createProduct } from "../helper/createProduct";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/file/urlToFile";
import { X } from "lucide-react";
import { productsFormSchema } from "../schema/productFormSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminsDropdown from "@/components/admins_dropdown";
import { fetchMedicineType } from "@/pages/medicine_type/helpers/fetchMedicineType";
import { Textarea } from "@/components/ui/textarea";
import { fetchBrand } from "@/pages/brand/helpers/fetchBrand";
import { MultiSelect } from "react-multi-select-component";
import { fetchHsnCodes } from "@/pages/hsn_codes/helpers/fetchHsnCodes";

const ProductsForm = ({ initialData, isEditMode }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const role = useSelector(selectAdminRole);
  const reduxAdminId = useSelector(selectAdminId);

  const [currentAdmin, setCurrentAdmin] = useState(null);

  const { data: medicineTypes = [] } = useQuery({
    queryKey: ["medicine_types_list"],
    queryFn: fetchMedicineType,
    select: (data) => data?.response?.data?.data,
  });

  const { data: brandList = [] } = useQuery({
    queryKey: ["brand_list"],
    queryFn: fetchBrand,
    select: (data) => data?.response?.data?.data,
  });

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
      instock: initialData?.instock ?? true,
      manufacturer: initialData?.manufacturer || "",
      consumed_type: initialData?.consumed_type || "",
      expiry_date: initialData?.expiry_date || "",
      images: [],
      banner_image: "",
      uploaded_by_brand: initialData?.uploaded_by_brand || null,
      is_best_seller: initialData?.is_best_seller || false,
      category: initialData?.category || [],
      medicine_type: initialData?.medicine_type?._id || null,
      product_type: initialData?.product_type || "product",
      is_active: initialData?.is_active ?? true,
      quantity: initialData?.quantity || 0,
      hsn_code: initialData?.hsn_code?._id || null,
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

  useEffect(() => {
    if (role === "super_admin") {
      setCurrentAdmin(initialData?.created_by_admin);
    }
  }, [isEditMode, initialData]);

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
    mutationFn: (data) =>
      updateProduct({
        id: role === "super_admin" ? id : currentAdmin,
        payload: data,
      }),
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

  console.log(form.getValues());

  const onSubmit = async (data) => {
    const formData = new FormData();

    if (role === "super_admin" && !currentAdmin) {
      toast.error("Please select an admin to upload the product.");
      return;
    }

    Object.entries(data).forEach(([key, value]) => {
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

    if (isEditMode) {
      updateMutation.mutate(formData);
    } else {
      const params = {
        ...(role === "super_admin" && currentAdmin
          ? { is_created_by_super_admin: true }
          : {}),
      };
      formData.append(
        "created_by_admin",
        role === "super_admin" ? currentAdmin : reduxAdminId
      );

      createMutation.mutate(formData, params);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <ProductBasicFields form={form} />
          <ProductPriceFields form={form} />
          {/* <ProductStockFields form={form} /> */}
          <ProductMetaFields
            form={form}
            role={role}
            currentAdmin={currentAdmin}
            setCurrentAdmin={setCurrentAdmin}
            isEditMode={isEditMode}
            medicineTypes={medicineTypes}
            brandList={brandList}
          />
          <ProductCategoryField form={form} currentAdmin={currentAdmin} />
          <ProductImageFields form={form} />
          <ProductTaxFields form={form} />
          <ProductStatusFields form={form} isEditMode={isEditMode} />
        </div>
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

function ProductBasicFields({ form }) {
  return (
    <>
      {/* Name */}
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
      {/* Small Description */}
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="small_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter small description"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Full Description */}
      <div className="col-span-6">
        <FormField
          control={form.control}
          name="full_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter full description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function ProductPriceFields({ form }) {
  return (
    <>
      {/* Price */}
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
      {/* Discounted Price */}
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
      {/* DND Discounted Price */}
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
      {/* Salesperson Discounted Price */}
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
    </>
  );
}

function ProductStockFields({ form }) {
  return (
    <>
      {/* In Stock */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="instock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In Stock</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">In Stock</SelectItem>
                    <SelectItem value="false">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function ProductMetaFields({
  form,
  role,
  currentAdmin,
  setCurrentAdmin,
  isEditMode,
  medicineTypes,
  brandList,
}) {
  return (
    <>
      {/* Manufacturer */}
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
      {/* Consumed Type */}
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
      {/* Expiry Date */}
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
      {/* Admins Dropdown */}
      {role === "super_admin" && (
        <div className="col-span-3">
          <AdminsDropdown
            currentAdmin={currentAdmin}
            setCurrentAdmin={setCurrentAdmin}
            isDisabled={isEditMode}
          />
        </div>
      )}
      {/* Medicine Type */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="medicine_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medicine Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(medicineTypes) &&
                      medicineTypes.map((type) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Uploaded by Brand */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="uploaded_by_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uploaded by Brand</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(brandList) &&
                      brandList.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

function ProductCategoryField({ form, currentAdmin }) {
  const { data: categoryData = [], isLoading } = useQuery({
    queryKey: ["categories", currentAdmin],
    queryFn: async () => {
      const { fetchCategories } = await import(
        "@/pages/categories/helpers/fetchCategories"
      );
      return fetchCategories({
        params: {
          ...(currentAdmin ? { admin_id: currentAdmin } : {}),
        },
      });
    },
  });

  const categoriesData = categoryData?.response?.data || [];
  const categoryOptions =
    categoriesData && categoriesData.length > 0
      ? categoriesData.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }))
      : [];

  // Convert value to MultiSelect format
  const selected = categoryOptions.filter((opt) =>
    Array.isArray(form.watch("category"))
      ? form.watch("category").includes(opt.value)
      : false
  );

  return (
    <div className="col-span-3">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <MultiSelect
                options={categoryOptions}
                value={selected}
                onChange={(selectedOptions) =>
                  field.onChange(selectedOptions.map((opt) => opt.value))
                }
                labelledBy="Select categories"
                isLoading={isLoading}
                className="w-full"
                hasSelectAll={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ProductImageFields({ form }) {
  return (
    <>
      {/* Banner Image */}
      <div className="col-span-3">
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

      {/* Images */}
      <div className="col-span-3">
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
    </>
  );
}

function ProductTaxFields({ form }) {
  const { data: hsnCodes } = useQuery({
    queryKey: ["hsn_codes"],
    queryFn: () => fetchHsnCodes({}),
    select: (data) => data?.response?.data?.data,
  });

  console.log("HSN Codes:", hsnCodes);

  return (
    <div className="col-span-3">
      <FormField
        control={form.control}
        name="hsn_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>HSN Code</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(hsnCodes) &&
                    hsnCodes.map((code) => (
                      <SelectItem key={code._id} value={code._id}>
                        {code.hsn_code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ProductStatusFields({ form, isEditMode }) {
  return (
    <>
      {/* Is Best Seller */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="is_best_seller"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Best Seller</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Is Active */}
      <div className="col-span-3">
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Active</FormLabel>
              <FormControl>
                <Select
                  value={field.value ? "true" : "false"}
                  onValueChange={(val) => field.onChange(val === "true")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-3">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEditMode ? "Add" : "Add"} Product Quantity
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter quantity"
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
          name="product_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}

export default ProductsForm;
