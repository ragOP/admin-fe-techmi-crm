import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createSubAdmin = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.sub_admin,
      method: "POST",
      data: payload,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
