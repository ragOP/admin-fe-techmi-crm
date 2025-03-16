import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchContacts = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.contact}`,
      method: "GET",
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
