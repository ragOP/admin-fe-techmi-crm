import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getFaq = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.faq,
      method: "GET",
    });

    return apiResponse?.response?.data;
  } catch (error) {
    console.error(error);
  }
};
