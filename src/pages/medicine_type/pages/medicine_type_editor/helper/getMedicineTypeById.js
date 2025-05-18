import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getMedicineTypeById = async ({ id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.medicine_type}/${id}`,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
