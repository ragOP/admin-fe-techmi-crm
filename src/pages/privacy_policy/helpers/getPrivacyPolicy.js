import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getPrivacyPolicy = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.privacy_policy}`,
      method: "GET",
    });

    return apiResponse?.response?.data;
  } catch (error) {
    console.error(error);
  }
};
