import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateTermsConditions = async ({ payload, id }) => {
  try {
    console.log(">>>>>>>>>>>>>>>>>>>>>>>paylod from update", payload);
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}/${id}`,
      method: "PUT",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
