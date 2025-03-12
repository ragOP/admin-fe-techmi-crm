import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchProducts = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.product}/admin/`,
      method: "GET",
      params,
    });

    return apiResponse
  } catch (error) {
    console.error(error);
  }
};

