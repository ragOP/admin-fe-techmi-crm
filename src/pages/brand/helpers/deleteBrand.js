import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteBrand = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.brands}/${id}`,
      method: "DELETE",
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
