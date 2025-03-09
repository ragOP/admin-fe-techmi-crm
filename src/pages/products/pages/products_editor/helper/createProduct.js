import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createProduct = async (formData) => {
  try {
    const response = await apiService({
      endpoint: endpoints.product,
      method: "POST",
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
