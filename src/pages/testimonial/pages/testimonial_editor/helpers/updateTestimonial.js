import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateTestimonial = async ({ id, payload }) => {
  return await apiService({
    endpoint: `${endpoints.testimonial}/${id}`,
    method: "PUT",
    data: payload,
  });
};
