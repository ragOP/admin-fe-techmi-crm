import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const deleteHsnCodes = async (id) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.hsn_codes}/${id}`,
      method: "DELETE",
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
