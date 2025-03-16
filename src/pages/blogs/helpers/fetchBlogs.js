import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchBlogs = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
