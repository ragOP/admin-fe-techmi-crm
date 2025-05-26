import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchTestimonials = async ({ params }) => {
  const response = await apiService({
    endpoint: endpoints.testimonial,
    method: "GET",
    params
  });

  return response?.response?.data || [];
};

export const deleteTestimonial = async (id) => {
  const response = await apiService({
    endpoint: `${endpoints.testimonial}/${id}`,
    method: "DELETE",
  });

  return response?.response?.data;
};
