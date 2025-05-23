import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateAdmin = async ({ id, payload }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.admin}/${id}`,
      method: "PATCH",
      data: payload,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
