import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const createBlog = async (formData) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}`,
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
