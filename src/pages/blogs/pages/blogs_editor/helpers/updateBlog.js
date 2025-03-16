import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateBlog = async ({ payload, id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.blogs}/${id}`,
      method: "PUT",
      data: payload,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
