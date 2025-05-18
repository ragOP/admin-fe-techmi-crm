import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchBrand = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.brands,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
