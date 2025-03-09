import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchAdmins = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.admin,
      method: "GET",
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
};
