import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updatePrivacyPolicy = async ({ payload, id }) => {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>paylod from update", payload);
    const apiResponse = await apiService({
      endpoint: `${endpoints.privacy_policy}/${id}`,
      method: "PUT",
      data: payload,
    });

    console.log(">>>rwsponse", apiResponse);
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
