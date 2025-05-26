import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchProductHistoryById = async ({ id, params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.productInventoryHistory}/product/${id}`,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error("Error fetching product history:", error);
  }
};
