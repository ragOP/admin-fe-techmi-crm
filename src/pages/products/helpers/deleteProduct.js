import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteProduct = async (id) => {
    try {
      const apiResponse = await apiService({
        endpoint: `${endpoints.product}/${id}`,
        method: "DELETE",
      });
  
      if (apiResponse?.response?.success) {
        return apiResponse?.response?.data;
      }
  
      return [];
    } catch (error) {
      console.error(error);
    }
  };