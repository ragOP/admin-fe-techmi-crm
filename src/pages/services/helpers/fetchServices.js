import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchServices = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.service,
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

export const deleteService = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.service}/${id}`,
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
