import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createMedicineType = async (payload) => {
  try {
    const response = await apiService({
      endpoint: endpoints.medicine_type,
      method: "POST",
      data: payload,
     
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
