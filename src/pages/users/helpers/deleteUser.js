import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteUser = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.user}/${id}`,
      method: "DELETE",
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
};
