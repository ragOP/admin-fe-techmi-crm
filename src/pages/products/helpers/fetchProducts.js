import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchProducts = async ({ params, role }) => {
  try {
    const apiResponse = await apiService({
      endpoint:
        role === "super_admin"
          ? `${endpoints.product}`
          : `${endpoints.product}/admin/`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
