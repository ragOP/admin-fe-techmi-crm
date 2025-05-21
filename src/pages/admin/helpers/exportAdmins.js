import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const exportAdmins = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.admin}/export`,
      params,
    });
    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
