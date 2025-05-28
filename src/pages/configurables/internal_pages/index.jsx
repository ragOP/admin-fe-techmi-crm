import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchInternal, postInternal } from "../helper";
import NavbarItem from "@/components/navbar/navbar_item";
import { useQuery } from "@tanstack/react-query";

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

  const { data: internalConfig, isLoading } = useQuery({
    queryKey: ["internalConfig"],
    queryFn: fetchInternal,
    select: (data) => data?.response?.data,
  })

  console.log("internalConfig", internalConfig);

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

  const handleMultipleSliderUpload = async (files) => {
    if (!files || files.length === 0) return;

    // files types validation
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG or JPG files are allowed.");
        return;
      }
    }
    
    setLoading((prev) => ({ ...prev, sliderImages: true }));
    
    try {
      const formData = new FormData();
      
      // Append all files to FormData
      Array.from(files).forEach((file) => {
        formData.append("file", file);
      });
      
      formData.append("field", "sliderImages");
      
      const response = await postInternal({
        data: formData,
      });

      console.log(response)
      
      // Update config with the new slider images array from server
      setConfig((prev) => ({
        ...prev,
        sliderImages: response?.data?.sliderImages || response.data
      }));
      
      toast.success(`${files.length} slider image(s) uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to upload slider images -> ${error?.message}. Try again.`);
    }
    
    setLoading((prev) => ({ ...prev, sliderImages: false }));
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = config.sliderImages.filter((_, i) => i !== index);
    
    setLoading((prev) => ({ ...prev, [`remove_${index}`]: true }));
    
    try {
      const formData = new FormData();
      formData.append("field", "sliderImages");
      formData.append("value", JSON.stringify(updatedImages));
      
      await postInternal({
        data: formData,
      });
      
      setConfig((prev) => ({
        ...prev,
        sliderImages: updatedImages,
      }));
      
      toast.success("Image removed successfully!");
    } catch (error) {
      toast.error("Failed to remove image from server");
    }
    
    setLoading((prev) => ({ ...prev, [`remove_${index}`]: false }));
  };

  const handleUpdateDescription = async () => {
    setLoading((prev) => ({ ...prev, aboutDescription: true }));
    
    try {
      const formData = new FormData();
      formData.append("field", "aboutDescription");
      formData.append("value", config.aboutDescription);
      
      await postInternal({
        data: formData,
      });
      
      toast.success("About description updated successfully!");
    } catch (error) {
      toast.error(`Failed to update description -> ${error?.message}. Try again.`);
    }
    
    setLoading((prev) => ({ ...prev, aboutDescription: false }));
  };

  return (
   <>
   <NavbarItem title="Internal Configuration" breadcrumbs={breadcrumbs} />
    <div className="px-10 py-4 w-full space-y-1">

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="font-semibold text-lg text-foreground capitalize">About Description</label>
          {internalConfig?.aboutDescription && (
            <Textarea
            className="mt-2 w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={internalConfig.aboutDescription || ""}
            onChange={(e) => setConfig({ ...config, aboutDescription: e.target.value })}
          />
          )}
          <Button 
            variant="default" 
            disabled={isLoading} 
            className="w-full"
            onClick={handleUpdateDescription}
          >
            {isLoading ? "Updating..." : "Update About Description"}
          </Button>
        </div>

        {["aboutUsImage", "flyer1"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-semibold text-lg text-foreground capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input 
              type="file" 
              accept="image/*"
              className="mt-2 w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => handleFileUpload(field, e.target.files[0])} 
            />
            {(preview[field] || config[field]) && (
              <img 
                src={preview[field] || config[field]} 
                alt={field} 
                className="mt-2 w-full h-48 object-cover rounded-lg shadow-md border border-gray-700" 
              />
            )}
          </div>
        ))}

        <div className="space-y-3">
          <label className="font-semibold text-lg text-foreground capitalize">Slider Images</label>
          <input 
            type="file" 
            multiple
            accept="image/*"
            className="mt-2 w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => handleMultipleSliderUpload(e.target.files)} 
          />
          <Button 
            variant="default" 
            disabled={loading.sliderImages} 
            className="w-full"
            onClick={() => document.querySelector('input[type="file"][multiple]').click()}
          >
            {loading.sliderImages ? "Uploading..." : "Select & Upload Slider Images"}
          </Button>
          
          {internalConfig?.sliderImages && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {internalConfig.sliderImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`Slider ${index + 1}`} 
                    className="w-full h-32 object-cover rounded-lg shadow-md border border-gray-700" 
                  />
                  <button
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    onClick={() => handleRemoveImage(index)}
                    disabled={loading[`remove_${index}`]}
                  >
                    {loading[`remove_${index}`] ? "..." : "✕"}
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {internalConfig?.sliderImages &&  internalConfig.sliderImages.length === 0 &&  (
            <p className="text-gray-400 text-center py-8">No slider images uploaded yet</p>
          )}
        </div>
      </div>
    </div>
   </>
  );
};

export default InternalConfig;