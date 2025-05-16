import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchSalesAndOrders = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.dashboard}/sales-and-orders`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};
