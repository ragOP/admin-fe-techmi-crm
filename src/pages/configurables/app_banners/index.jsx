import React, { useState, useEffect } from "react";
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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  fetchAppBanners,
  postAppBanners,
  deleteAppBanner,
} from "../helper";

const SortableItem = ({ id, banner, index, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`transition-all duration-200 border-l-4 ${
        banner.type === "new" ? "border-l-green-500" : "border-l-blue-500"
      }`}
    >
      <CardContent {...listeners}>
        <div className="flex items-center gap-3">
          <div className="cursor-grab hover:cursor-grabbing p-1 text-gray-400 hover:text-gray-600">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <div className="text-base font-medium">Banner {index + 1}</div>
            <div className="text-sm text-gray-500 truncate">
              {(banner?.name || "").slice(0, 10)} •{" "}
              {banner.type === "new" ? "New upload" : "Existing"}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(banner._id, index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AppBanners = () => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(false);
  const breadcrumbs = [{ title: "App Banners", isNavigation: false }];
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAppBanners({});
        setConfig(response?.response?.data[0].banner || []);
      } catch (error) {
        toast.error("Failed to load banners");
      }
    };
    fetchData();
  }, []);

  const handleSingleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG or WEBP files are allowed.");
      return;
    }

    const previewURL = URL.createObjectURL(file);

    const newBanner = {
      name: file.name,
      file: file,
      url: previewURL,
      type: "new",
      _id: crypto.randomUUID(), // For unique drag id
    };
    const newConfig = [...config, newBanner];
    setConfig(newConfig);

    setLoading(true);
    try {
      const payload = new FormData();
      newConfig.forEach((item, index) => {
        payload.append(`files[${index}][name]`, item.name);
        if (item.url && !item.file) {
          payload.append(`files[${index}][url]`, item.url);
        } else {
          payload.append(`files[${index}][file]`, item.file);
        }
      });

      await postAppBanners({ data: payload });
      toast.success("Banner uploaded successfully!");
      event.target.value = "";
    } catch (error) {
      toast.error(`Upload failed: ${error?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanner = async (id, index) => {
    const updatedBanners = [...config];
    try {
      await deleteAppBanner({ id });
      updatedBanners.splice(index, 1);
      setConfig(updatedBanners);
      toast.success("Banner deleted successfully!");
    } catch (error) {
      toast.error(`Deletion failed: ${error?.message || "Unknown error"}`);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = config.findIndex((item) => item._id === active.id);
      const newIndex = config.findIndex((item) => item._id === over.id);
      setConfig((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <>
      <NavbarItem title="App Banners" breadcrumbs={breadcrumbs} />
      <div className="p-6 w-full mx-auto">
        <div className="flex gap-6 mb-8">
          <div className="w-3/5">
            <h2 className="text-xl font-semibold mb-4">Banner List</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={config.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {config.map((banner, index) => (
                    <SortableItem
                      key={banner._id}
                      id={banner._id}
                      banner={banner}
                      index={index}
                      onDelete={handleDeleteBanner}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {config.length === 0 && (
              <Card>
                <CardContent className="flex items-center justify-center h-32 text-gray-500">
                  No banners added yet. Upload your first banner below.
                </CardContent>
              </Card>
            )}
          </div>

          <div className="w-2/6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            {config.length > 0 ? (
              <Carousel>
                <CarouselContent>
                  {config.map((banner, index) => (
                    <CarouselItem key={`preview-${index}-${banner.name}`}>
                      <div className="p-1 relative">
                        <div className="flex aspect-video items-center justify-center bg-muted rounded-lg relative">
                          <img
                            src={banner.url || banner}
                            alt={`Banner ${index + 1}`}
                            className="object-cover h-full w-full"
                          />
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                            {index + 1} / {config.length}
                          </div>
                          {banner.type === "new" && (
                            <div className="absolute top-2 right-2">
                              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {config.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64 text-gray-500">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto mb-2" />
                    <p>No banners to preview</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card className="bg-background border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl text-foreground font-semibold mb-2">
                Add Banner
              </h2>
              <p className="text-gray-600 mb-4">
                Select an image file to upload (JPEG, PNG, WEBP • Max 5MB)
              </p>
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
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
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
