import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchUsers = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.users,
      method: "GET",
      params,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
};
