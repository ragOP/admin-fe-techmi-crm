import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchCategories = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.category,
      method: "GET",
      params,
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
};

export const deleteCategory = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.category}/${id}`,
      method: "DELETE",
    });

    if (apiResponse?.response?.success) {
      return apiResponse?.response?.data;
    }

    return [];
  } catch (error) {
    console.error(error);
  }
}
