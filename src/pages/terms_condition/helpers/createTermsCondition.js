import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createTermsCondition = async (data) => {
    console.log(">>>>>>>>>>>>> from create ", data);
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_condition}`,
      method: "POST",
      data,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
