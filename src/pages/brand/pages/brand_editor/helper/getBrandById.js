import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getBrandById = async ({ id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.brands}/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
