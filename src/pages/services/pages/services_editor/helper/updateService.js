import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateService = async ({ id, payload }) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.service}/${id}`,
      method: "PUT",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
