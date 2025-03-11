import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchSubAdmins = async ({ adminId }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.sub_admin,
      method: "GET",
      params: {
        id: adminId,
      },
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
};
