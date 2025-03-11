import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const HomeConfig = () => {
  const [config, setConfig] = useState({
    heading: "",
    subheading: "",
    banner1: "",
    banner2: "",
    banner3: "",
    banner4: "",
    banner5: ""
  });
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    axios.get("https://techmi-crm-be.onrender.com/api/home").then((res) => {
      setConfig(res.data.data || {});
    });
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
      await axios.post("https://techmi-crm-be.onrender.com/api/home", formData);
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
      const response = await axios.post("https://techmi-crm-be.onrender.com/api/home", formData);
      setConfig((prev) => ({ ...prev, [field]: response.data.url }));
      toast.success(`${field} uploaded successfully!`);
    } catch (error) {
      toast.error(`Failed to update -> ${error?.message}. Try again.`);
    }
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="p-10 max-w-4xl mx-auto w-full space-y-10">
      <h2 className="text-2xl font-semibold text-white text-center">Homepage Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {["heading", "subheading"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-medium text-lg text-white capitalize">{field}</label>
            <Input
              className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-md"
              value={config[field] || ""}
              onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
            />
            <Button variant="default" disabled={loading[field]} className="w-full" onClick={() => handleUpdate(field, config[field])}>
              {loading[field] ? "Updating..." : `Update ${field}`}
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(5)].map((_, index) => {
          const field = `banner${index + 1}`;
          return (
            <div key={field} className="space-y-3">
              <label className="font-medium text-lg text-white capitalize">{field}</label>
              <Input type="file" className="w-full bg-gray-800 border-gray-700 text-white rounded-md px-4 py-1" onChange={(e) => handleFileUpload(field, e.target.files[0])} />
              {(preview[field] || config[field]) && (
                <img src={preview[field] || config[field]} alt={field} className="mt-2 w-full h-48 object-cover rounded-lg shadow-md" />
              )}
              <Button variant="default" disabled={loading[field]} className="w-full" onClick={() => handleUpdate(field, config[field])}>
                {loading[field] ? "Updating..." : `Update ${field}`}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeConfig;
