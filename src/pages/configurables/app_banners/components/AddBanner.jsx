import React from "react";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AddBanner = ({ handleFileSelection, loading, formData }) => {
  const { file, fileName, fileUrl } = formData || {};

  const handleRemoveFile = () => {
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    // Clear the file input
    const fileInput = document.getElementById("banner-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="banner-upload" className="text-sm font-medium">
        Banner Image
      </Label>
      
      {!file ? (
        // File Upload Area
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              JPEG, PNG or WEBP files only
            </p>
          </div>
          <Input
            id="banner-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelection}
            className="hidden"
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById("banner-upload").click()}
            disabled={loading}
          >
            Choose File
          </Button>
        </div>
      ) : (
        // File Preview
        <div className="border rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Image className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Image Preview */}
          {fileUrl && (
            <div className="w-full">
              <img
                src={fileUrl}
                alt="Banner preview"
                className="max-w-full h-auto max-h-48 rounded-md object-contain mx-auto"
              />
            </div>
          )}
          
          {/* Change File Button */}
          <div className="pt-2 border-t">
            <Input
              id="banner-upload-change"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelection}
              className="hidden"
              disabled={loading}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("banner-upload-change").click()}
              disabled={loading}
            >
              Change File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddBanner;