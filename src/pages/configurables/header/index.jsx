import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fetchHeader, postHeader } from "../helper";

const HeaderConfig = () => {
  const [config, setConfig] = useState({
    address: "",
    timming: "",
    phoneNumber: "",
    email: "",
    mapLink: "",
    facebookLink: "",
    twitterLink: "",
    linkedInLink: "",
    instagramLink: "",
    logo: ""
  });
  const [loading, setLoading] = useState({});
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      const data = await fetchHeader({});
      setConfig(data.response.data || {});
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

    if (field === "logo") {
      formData.append("file", value);
    } else {
      formData.append("value", value);
    }

    try {
      const response = await postHeader({
        data: formData,})
      if (field === "logo") {
        setConfig((prev) => ({ ...prev, logo: response.data.url }));
      } else {
        setConfig((prev) => ({ ...prev, [field]: value }));
      }
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to update -> ${error?.message}. Try again.`);
    }
    setLoading((prev) => ({ ...prev, [field]: false }));
  };

  return (
    <div className="p-10 max-w-4xl mx-auto w-full space-y-10">
      <h2 className="text-3xl font-bold text-white text-center">Header Configuration</h2>
      
      <div className="grid grid-cols-2 gap-8">
        {["address", "timming", "phoneNumber", "email"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-semibold text-lg text-white capitalize">{field}</label>
            <Textarea
              className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={config[field] || ""}
              onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
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

      <div className="grid grid-cols-2 gap-8">
        {["mapLink", "facebookLink", "twitterLink", "linkedInLink", "instagramLink"].map((field) => (
          <div key={field} className="space-y-3">
            <label className="font-semibold text-lg text-white capitalize">{field.replace("Link", " Link")}</label>
            <Textarea
              className="w-full bg-gray-800 border-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={config[field] || ""}
              onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
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

      <div className="space-y-3">
        <label className="font-semibold text-lg text-white capitalize">Logo</label>
        <input
          type="file"
          className="w-full bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setLogoFile(e.target.files[0])}
        />
        {config.logo && (
          <img
            src={config.logo}
            alt="Logo"
            className="mt-2 w-full h-48 object-cover rounded-lg shadow-md border border-gray-700"
          />
        )}
        <Button
          variant="default"
          className="w-full"
          onClick={() => handleUpdate("logo", logoFile)}
        >
          {loading.logo ? "Updating..." : "Update Logo"}
        </Button>
      </div>
    </div>
  );
};

export default HeaderConfig;
