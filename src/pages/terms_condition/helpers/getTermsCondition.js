import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getTermsCondition = async () => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_condition}`,
      method: "GET",
    });

    return apiResponse?.response?.data;
  } catch (error) {
    console.error(error);
  }
};
