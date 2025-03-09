import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getServiceById } from "../services_editor/helper/getServiceById";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function ServiceDetail() {
  const { id } = useParams();

  const {
    data: serviceRes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () => getServiceById({ id }),
  });

  const service = serviceRes?.response?.data;

  if (isLoading) {
    return (
      <p className="text-center text-gray-600">Loading service details...</p>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!service) {
    return <p className="text-center text-gray-600">Service not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Service Header */}
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <img
          src={service.images[0]}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold drop-shadow-lg">
            {service.name}
          </h1>
        </div>
      </div>

      {/* Service Description */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">About {service.name}</h2>
        <p className="text-gray-700 mt-2">{service.description}</p>
      </div>

      {/* Images Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Service Image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md transition-transform transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Service Details
        </h2>
        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-700">Slug:</span>
            <span className="text-gray-600">{service.slug}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created By:</span>
            <span className="text-gray-600">{service.created_by_admin}</span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Created At:</span>
            <span className="text-gray-600">
              {new Date(service.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-700">Last Updated:</span>
            <span className="text-gray-600">
              {new Date(service.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          Contact Us <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
