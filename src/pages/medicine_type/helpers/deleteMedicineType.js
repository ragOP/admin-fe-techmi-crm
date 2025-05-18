import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteMedicineType = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.medicine_type}/${id}`,
      method: "DELETE",
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
