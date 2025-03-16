import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createBlog = async ({ payload }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}`,
      method: "POST",
      payload,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
