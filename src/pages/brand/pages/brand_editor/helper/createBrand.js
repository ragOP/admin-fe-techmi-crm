import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createBrand = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.brands,
      method: "POST",
      data: payload,
     
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
