import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const exportDashboard = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.dashboard}/export`,
      params,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
