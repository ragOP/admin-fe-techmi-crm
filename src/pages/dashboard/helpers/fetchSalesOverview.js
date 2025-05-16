import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchSalesOverview = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.dashboard}/sales-overview`,
      method: "GET",
    });

    return apiResponse;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};
