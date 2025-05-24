import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createFaq = async (data) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.faq}`,
      method: "POST",
      data,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
