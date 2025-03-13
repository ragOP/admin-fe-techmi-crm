import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchOrders = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.order,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
