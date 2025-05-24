import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const reorderFaq = async (payload) => {
  console.log("payload", payload);
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.faq,
      method: "PUT",
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
