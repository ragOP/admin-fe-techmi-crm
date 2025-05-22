import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { fetchServicePage, postServicePage } from "../helper";
import NavbarItem from "@/components/navbar/navbar_item";

const ServiceConfig = () => {
  const [config, setConfig] = useState({
    heading: "",
    subheading: "",
    houseCleaningDescription: "",
    houseCleaningImage: "",
    houseCleaningReviews: "",
    pharmaDescription: "",
    pharmaImage: "",
    pharmaReviews: "",
    laundryDescription: "",
    laundryImage: "",
    laundryReviews: "",
  });
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState({});

  const breadcrumbs = [{ title: "Service", isNavigation: true }];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchServicePage({});
      setConfig(response.response.data || {});
    };
    fetchData();
  }, []);

  const handleUpdate = async (field, value) => {
    if (!value) {
      toast.error("Please provide a value before updating.");
      return;
    }
    setLoading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("field", field);
    formData.append("value", value);

    try {
      await postServicePage({
        data: formData,
      });
      setConfig((prev) => ({ ...prev, [field]: value }));
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to update -> ${error?.message}. Try again.`);
    }
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setLoading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    const fileURL = URL.createObjectURL(file);
    setPreview((prev) => ({ ...prev, [field]: fileURL }));

    try {
      const response = await postServicePage({
        data: formData,
      });
      setConfig((prev) => ({ ...prev, [field]: response.data.url }));
      toast.success(`${field} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to update -> ${error?.message}. Try again.`);
    }
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  return (
   <>
   <NavbarItem title="Services" breadcrumbs={breadcrumbs} />
    <div className="px-10 py-4 mb-4 w-full space-y-10">
      <div className="grid grid-cols-2 gap-6">
        {["heading", "subheading"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-medium text-lg text-foreground capitalize">
              {field}
            </label>
            <Input
              className="mt-2 w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              value={config[field] || ""}
              onChange={(e) =>
                setConfig({ ...config, [field]: e.target.value })
              }
            />
            <Button
              variant="default"
              disabled={loading[field]}
              className="w-full"
              onClick={() => handleUpdate(field, config[field])}
            >
              {loading[field] ? "Updating..." : `Update ${field}`}
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {["houseCleaningImage", "pharmaImage", "laundryImage"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-medium text-lg text-foreground capitalize">
              {field}
            </label>
            <input
              type="file"
              className="mt-2 w-full bg-gray-800 border-gray-700 text-white rounded-md px-4 py-1"
              onChange={(e) => handleFileUpload(field, e.target.files[0])}
            />
            {(preview[field] || config[field]) && (
              <img
                src={preview[field] || config[field]}
                alt={field}
                className="mt-2 w-full h-48 object-cover rounded-lg shadow-md"
              />
            )}
            <Button
              variant="default"
              disabled={loading[field]}
              className="w-full"
              onClick={() => handleUpdate(field, config[field])}
            >
              {loading[field] ? "Updating..." : `Update ${field}`}
            </Button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        {["houseCleaningReviews", "pharmaReviews", "laundryReviews"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-medium text-lg text-foreground capitalize">
              {field}
            </label>
            <Input
              className="mt-2 w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              type="number"
              value={config[field] || ""}
              onChange={(e) =>
                setConfig({ ...config, [field]: e.target.value })
              }
            />
            <Button
              variant="default"
              disabled={loading[field]}
              className="w-full"
              onClick={() => handleUpdate(field, config[field])}
            >
              {loading[field] ? "Updating..." : `Update ${field}`}
            </Button>
          </div>
        ))}
      </div>
        {[
          "houseCleaningDescription",
          "pharmaDescription",
          "laundryDescription",
        ].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-medium text-lg text-foreground capitalize">
              {field}
            </label>
            <Textarea
              className="mt-2 w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              value={config[field] || ""}
              onChange={(e) =>
                setConfig({ ...config, [field]: e.target.value })
              }
            />
            <Button
              variant="default"
              disabled={loading[field]}
              className="w-full"
              onClick={() => handleUpdate(field, config[field])}
            >
              {loading[field] ? "Updating..." : `Update ${field}`}
            </Button>
          </div>
        ))}
    </div>
   </>
  );
};

export default ServiceConfig;
