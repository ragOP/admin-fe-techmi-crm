import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getTestimonialById = async ({ id }) => {
  return await apiService({
    endpoint: `${endpoints.testimonial}/${id}`,
    method: "GET",
  });
};
