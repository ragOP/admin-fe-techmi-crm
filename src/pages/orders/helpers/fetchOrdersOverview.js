import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchOrdersOverview = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.order}/overview`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
