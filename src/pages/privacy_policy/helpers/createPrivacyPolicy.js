import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createPrivacyPolicy = async (data) => {
    console.log(">>>>>>>>>>>>> from create ", data);
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.privacy_policy}`,
      method: "POST",
      data,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
