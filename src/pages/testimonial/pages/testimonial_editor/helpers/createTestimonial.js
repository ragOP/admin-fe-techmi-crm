import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createTestimonial = async (data) => {
  return await apiService({
    endpoint: endpoints.testimonial,
    method: "POST",
    data,
  });
};
