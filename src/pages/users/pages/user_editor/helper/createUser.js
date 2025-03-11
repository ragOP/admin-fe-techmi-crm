import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createUser = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.admin_register,
      method: "POST",
      data: payload,
     
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
