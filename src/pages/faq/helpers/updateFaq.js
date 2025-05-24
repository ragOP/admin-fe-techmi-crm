import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateFaq = async ({ payload, id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.faq}/${id}`,
      method: "PUT",
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
