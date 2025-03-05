import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const loginUser = async (payload) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.login,
      method: "POST",
      data: payload,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
