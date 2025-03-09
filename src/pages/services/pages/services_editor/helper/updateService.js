import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateService = async (formData) => {
  try {
    const response = await apiService({
      endpoint: endpoints.service,
      method: "PATCH",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
