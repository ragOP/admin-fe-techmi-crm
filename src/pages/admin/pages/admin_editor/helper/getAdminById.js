import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getAdminById = async ({ id }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.admin}/${id}`,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
