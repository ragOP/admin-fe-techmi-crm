import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchBlogById = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};
