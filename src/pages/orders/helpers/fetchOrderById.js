import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchOrderById = async ({ orderId }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.order}/${orderId}`,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
