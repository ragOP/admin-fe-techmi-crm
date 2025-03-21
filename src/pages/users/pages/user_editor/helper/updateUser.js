import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateUser = async ({ id, payload }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.user}/${id}`,
      method: "PATCH",
      data: payload,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
