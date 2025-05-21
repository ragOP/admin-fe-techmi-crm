import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const exportOrders = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.order}/export`,
      params,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
