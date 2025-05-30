import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchDashboardOverview = async ({ params }) => {
  try {
    console.log("Fetching stats with params:", params);
    const apiResponse = await apiService({
      endpoint: `${endpoints.dashboard}/overview`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};
