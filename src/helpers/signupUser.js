import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const signupUser = async (payload) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.signup,
      method: "POST",
      data: payload,
    });

    return apiResponse;
  } catch (error) {
    console.log(error);
  }
};
