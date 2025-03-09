import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getCategoryById = async ({ id }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.category}/${id}`,
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
