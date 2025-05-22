import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchInternal, postInternal } from "../helper";
import NavbarItem from "@/components/navbar/navbar_item";

const InternalConfig = () => {
  const [config, setConfig] = useState({
    sliderImages: [],
    flyer1: "",
    aboutDescription: "",
    aboutUsImage: ""
  });
  const [loading, setLoading] = useState({});
  const [preview, setPreview] = useState({});

  const breadcrumbs = [{ title: "Internal", isNavigation: true }];

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchInternal({});
      setConfig(data.response.data || {});
    };
    fetchData();
  }, []);

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    setLoading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("field", field);

    const fileURL = URL.createObjectURL(file);
    setPreview((prev) => ({ ...prev, [field]: fileURL }));

    try {
      const response = await postInternal({
        data: formData,
      });
      setConfig((prev) => ({ ...prev, [field]: response.data.url }));
      toast.success(`${field} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to update -> ${error?.message}. Try again.`);
    }
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  const handleRemoveImage = (index) => {
    setConfig((prev) => ({
      ...prev,
      sliderImages: prev.sliderImages.filter((_, i) => i !== index),
    }));
    toast.success("Image removed successfully!");
  };

  return (
   <>
   <NavbarItem title="Internal Configuration" breadcrumbs={breadcrumbs} />
    <div className="p-10 max-w-4xl mx-auto w-full space-y-1">
      <h2 className="text-3xl font-bold text-foreground text-center">Internal Configuration</h2>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="font-semibold text-lg text-foreground capitalize">About Description</label>
          <Textarea
            className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={config.aboutDescription || ""}
            onChange={(e) => setConfig({ ...config, aboutDescription: e.target.value })}
          />
          <Button variant="default" disabled={loading.aboutDescription} className="w-full">
            Update About Description
          </Button>
        </div>

        {["aboutUsImage", "flyer1"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-semibold text-lg text-foreground capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input 
              type="file" 
              className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => handleFileUpload(field, e.target.files[0])} 
            />
            {(preview[field] || config[field]) && (
              <img 
                src={preview[field] || config[field]} 
                alt={field} 
                className="mt-2 w-full h-48 object-cover rounded-lg shadow-md border border-gray-700" 
              />
            )}
            <Button variant="default" className="w-full">Upload {field.replace(/([A-Z])/g, ' $1')}</Button>
          </div>
        ))}

        <div className="space-y-3">
          <label className="font-semibold text-lg text-foreground capitalize">Slider Images</label>
          <input 
            type="file" 
            className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => handleFileUpload("sliderImages", e.target.files[0])} 
          />
          <div className="grid grid-cols-3 gap-4">
            {config.sliderImages?.map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt={`Slider ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-md border border-gray-700" />
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default InternalConfig;
