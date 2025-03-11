import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getUserById = async ({ id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.user}/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
