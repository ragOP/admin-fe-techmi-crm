import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteTermsCondition = async (id) => {
    console.log(">>>>>>>>>>>>> from delete ", id);
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_condition}/${id}`,
      method: "DELETE",
    });

    console.log(">>>rwsponse", apiResponse)
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
