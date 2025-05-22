import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GripVertical, Trash2, Upload } from "lucide-react";
import NavbarItem from "@/components/navbar/navbar_item";

const AppBanners = () => {
  const [config, setConfig] = useState({
    appBannerImages: [],
  });
  const [loading, setLoading] = useState(false);
    const breadcrumbs = [{ title: "App Banners", isNavigation: false }];

  // Mock initial data - replace with your actual fetchAppBanners API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call - replace with actual fetchAppBanners({})
        const mockData = {
          response: {
            data: {
              appBannerImages: [
                { id: "1", url: "/api/placeholder/800/400", type: "existing", name: "Banner 1" },
                { id: "2", url: "/api/placeholder/800/401", type: "existing", name: "Banner 2" },
                { id: "3", url: "/api/placeholder/800/402", type: "existing", name: "Banner 3" },
                { id: "4", url: "/api/placeholder/800/403", type: "existing", name: "Banner 4" },
              ]
            }
          }
        };
        setConfig(mockData.response.data || { appBannerImages: [] });
      } catch (error) {
        toast.error("Failed to load banners");
      }
    };
    fetchData();
  }, []);

  const handleSingleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG or WEBP files are allowed.");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should not exceed 5MB.");
      return;
    }

    setLoading(true);

    try {
      // Prepare payload for single file upload
      const payload = {
        files: [{ file }]
      };

      // Simulate API call - replace with actual postAppBanners({ data: payload })
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBanner = {
        id: `new-${Date.now()}`,
        url: URL.createObjectURL(file),
        type: "new",
        name: file.name,
        file: file
      };

      setConfig((prev) => ({
        ...prev,
        appBannerImages: [...prev.appBannerImages, newBanner],
      }));

      // Reset file input
      event.target.value = '';
      
      toast.success("Banner uploaded successfully!");
    } catch (error) {
      toast.error(`Upload failed: ${error?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = (index) => {
    const updatedBanners = [...config.appBannerImages];
    updatedBanners.splice(index, 1);
    setConfig((prev) => ({
      ...prev,
      appBannerImages: updatedBanners,
    }));
    toast.success("Banner deleted successfully!");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(config.appBannerImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setConfig((prev) => ({
      ...prev,
      appBannerImages: items,
    }));
  };

  const prepareBannerPayload = async () => {
    if (config.appBannerImages.length === 0) {
      toast.error("No banners to save");
      return;
    }

    try {
      const payload = {
        files: config.appBannerImages.map(banner => {
          // If it's a new banner with file, send the file
          if (banner.type === "new" && banner.file) {
            return { file: banner.file };
          } else {
            // If it's existing banner or reordered, send URL
            return { url: banner.url };
          }
        })
      };

      console.log("Payload structure:", payload);
      
      // Simulate API call - replace with actual postAppBanners({ data: payload })
      // const response = await postAppBanners({ data: payload });
      
      toast.success("Banners saved successfully!");
    } catch (error) {
      toast.error(`Save failed: ${error?.message || "Unknown error"}`);
    }
  };

  return (
    <>
     <NavbarItem title="App Banners" breadcrumbs={breadcrumbs} />
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">App Banners</h1>
        <Button 
          onClick={prepareBannerPayload}
          disabled={config.appBannerImages.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Save Changes
        </Button>
      </div>
      
      {/* Main Content Area - 60% List, 40% Preview */}
      <div className="flex gap-6 mb-8">
        {/* Left Side - Banner List (60%) */}
        <div className="w-3/5">
          <h2 className="text-xl font-semibold mb-4">Banner List</h2>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="banners">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {config.appBannerImages?.map((banner, index) => (
                    <Draggable
                      key={banner.id || `banner-${index}`}
                      draggableId={banner.id || `banner-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-all duration-200 ${
                            snapshot.isDragging ? "opacity-50 scale-95 shadow-lg" : "opacity-100 scale-100"
                          } border-l-4 ${
                            banner.type === "new" ? "border-l-green-500" : "border-l-blue-500"
                          }`}
                        >
                          <CardContent>
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                              >
                                <GripVertical className="h-5 w-5" />
                              </div>
                              
                              <div className="flex-1">
                                <div className="text-base font-medium">
                                  Banner {index + 1}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                  {banner.name || (typeof banner === "string" ? banner.split("/").pop() : `Banner ${index + 1}`)} • 
                                  {banner.type === "new" ? " New upload" : " Existing"}
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBanner(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {config.appBannerImages.length === 0 && (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="flex items-center justify-center h-32 text-gray-500">
                No banners added yet. Upload your first banner below.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Carousel Preview (40%) */}
        <div className="w-2/5">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          
          {config.appBannerImages.length > 0 ? (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Carousel>
                  <CarouselContent>
                    {config.appBannerImages?.map((banner, index) => (
                      <CarouselItem key={banner.id || index}>
                        <div className="p-1">
                          <div className="flex aspect-video items-center justify-center p-6 bg-muted rounded-lg">
                            <img
                              src={banner.url || banner}
                              alt={`Banner ${index + 1}`}
                              className="object-contain h-full w-full"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                              {index + 1} / {config.appBannerImages.length}
                            </div>
                            <div className="absolute top-2 right-2">
                              {banner.type === "new" && (
                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {config.appBannerImages?.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
                    </>
                  )}
                </Carousel>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-gray-500 border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto mb-2" />
                  <p>No banners to preview</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Section - Single File Upload */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-xl text-foreground font-semibold mb-2">Add Banner</h2>
            <p className="text-gray-600 mb-4">Select an image file to upload (JPEG, PNG, WEBP • Max 5MB)</p>
            
            <div className="relative inline-block">
              <Input
                type="file"
                accept="image/*"
                onChange={handleSingleFileUpload}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button 
                className={`${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                } text-white px-8 py-3 text-lg`}
                disabled={loading}
              >
                <Upload className="h-5 w-5 mr-2" />
                {loading ? "Uploading..." : "Choose File to Upload"}
              </Button>
            </div>
            
            {loading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-1/2"></div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default AppBanners;