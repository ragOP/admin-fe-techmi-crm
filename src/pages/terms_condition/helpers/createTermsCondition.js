import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createTermsCondition = async (formData) => {
    console.log(">>>>>>>>>>>>> from create ", formData);
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.terms_condition}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
