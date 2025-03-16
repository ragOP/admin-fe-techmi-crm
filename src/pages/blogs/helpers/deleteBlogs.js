import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteBlogs = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}/${id}`,
      method: "DELETE",
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
