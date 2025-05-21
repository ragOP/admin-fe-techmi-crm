import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createHsnCode = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.hsn_codes,
      method: "POST",
      data: payload,
     
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
