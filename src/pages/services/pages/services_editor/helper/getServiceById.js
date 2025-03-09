import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getServiceById = async ({ id }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.service}/${id}`,
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
