import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const updateOrderStatus = async ({ orderId, status }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.order}/${orderId}`,
      method: "PATCH",
      data: { status },
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};
