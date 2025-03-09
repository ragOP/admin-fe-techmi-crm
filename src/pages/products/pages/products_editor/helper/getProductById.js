import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const getProductById = async ({ id }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.product}/${id}`,
      method: "GET",
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
