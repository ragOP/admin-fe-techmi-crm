import React, { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import SortableItem from "./SortableItem";
import AddBanner from "./AddBanner";

const BannerList = ({
  config,
  products,
  sensors,
  onDragEnd,
  handleDeleteBanner,
  handleFileSelection,
  handleAddBanner,
  formData,
  loading,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  observerRef,
  dropdownRef,
}) => {
  // Local state for dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  // Transform products for dropdown display
  const productList = products.map((product) => ({
    label: product.name,
    value: product._id,
  }));

  // Set up intersection observer for infinite loading in dropdown
  useEffect(() => {
    if (!dropdownOpen || !hasNextPage || isFetchingNextPage) return;

    const timeoutId = setTimeout(() => {
      const observerElement = observerRef.current;

      if (!observerElement) {
        console.log("Observer element not found");
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log("Loading more products via intersection observer");
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          root: null, // Use viewport as root
          rootMargin: "50px",
        }
      );

      observer.observe(observerElement);

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [dropdownOpen, hasNextPage, isFetchingNextPage, fetchNextPage, products.length]);

  // Find selected product for display
  const selectedProduct = productList.find(
    (product) => product.value === selectedProductId
  );

  // Handle scroll-based loading as fallback
  const handleDropdownScroll = (e) => {
    const target = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      console.log("Loading more products via scroll");
      fetchNextPage();
    }
  };

  console.log("productList", products)
  console.log("selectedProductId", selectedProductId);
  return (
    <Dialog>
      <div className="w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Banner List</h2>
          <DialogTrigger asChild>
            <Button>Add Banner</Button>
          </DialogTrigger>
        </div>

        {/* Sortable Banner List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={config?.map((item) => item._id) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {config?.map((banner, index) => (
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

        {/* Empty state */}
        {config?.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center h-32 text-gray-500">
              No banners added yet. Upload your first banner below.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Banner Dialog */}
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Banner</DialogTitle>
          <DialogDescription>
            Select a product and upload a banner image
          </DialogDescription>
        </DialogHeader>

        {/* Product Selection Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="product-select" className="text-sm font-medium">
            Product
          </Label>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                id="product-select"
                variant="outline"
                role="combobox"
                aria-expanded={dropdownOpen}
                className="w-full justify-between"
                disabled={products.length === 0}
              >
                {selectedProduct?.label || "Select product..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent
              ref={dropdownRef}
              className="w-full p-0 max-h-60 overflow-y-auto"
              align="start"
              sideOffset={4}
              onWheel={handleDropdownScroll}
            >
              {productList.length > 0 ? (
                <>
                  {/* Product Options */}
                  {productList.map((product) => (
                    <DropdownMenuItem
                      key={product.value}
                      className="cursor-pointer"
                      onSelect={() => {
                        setSelectedProductId(product.value);
                        setDropdownOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedProductId === product.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {product.label}
                    </DropdownMenuItem>
                  ))}

                  {/* Loading Indicator */}
                  {hasNextPage && (
                    <DropdownMenuItem
                      disabled
                      className="flex items-center justify-center p-2"
                    >
                      <div
                        ref={observerRef}
                        className="flex items-center justify-center w-full text-sm text-muted-foreground"
                      >
                        {isFetchingNextPage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading more products...
                          </>
                        ) : (
                          <span
                            onClick={() => fetchNextPage()}
                            className="cursor-pointer hover:text-primary"
                          >
                            Load more products...
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  )}

                  {/* All Loaded Indicator */}
                  {!hasNextPage && products.length > 10 && (
                    <div className="p-2 text-center text-xs text-muted-foreground border-t">
                      All products loaded ({products.length} total)
                    </div>
                  )}
                </>
              ) : (
                <DropdownMenuItem disabled className="text-center">
                  {isFetchingNextPage ? "Loading products..." : "No products found"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* File Upload Component */}
        <div className="mt-6">
          <AddBanner
            handleFileSelection={handleFileSelection}
            loading={loading}
            formData={formData}
          />
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            disabled={!selectedProductId || !formData.file || loading}
            onClick={() => handleAddBanner(selectedProductId)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Banner...
              </>
            ) : (
              "Add Banner"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BannerList;