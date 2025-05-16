import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchProductById = async ({ id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.product}/${id}/`,
      method: "GET",
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
