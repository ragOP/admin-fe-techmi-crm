import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteFaq = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.faq}/${id}`,
      method: "DELETE",
    });

    console.log(">>>rwsponse", apiResponse);
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
