import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getTermsCondition = async () => {
    console.log(">>>>>>>>>>>>> from get ");
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_condition}`,
      method: "GET",
    });

    console.log(">>>rwsponse", apiResponse)
    return apiResponse.response.data;
  } catch (error) {
    console.error(error);
  }
};
