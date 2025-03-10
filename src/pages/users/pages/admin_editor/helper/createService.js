import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createAdmin = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.register,
      method: "POST",
      data: payload,
     
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
