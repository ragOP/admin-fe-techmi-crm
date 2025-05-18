import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchMedicineType = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.medicine_type,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
