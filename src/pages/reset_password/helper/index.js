import axios from "axios";
import { BACKEND_URL } from "@/api/enpoints";

export const resetPassword = async (id, values) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/admin/reset-password/${id}`,
      {
        password: values.password,
      }
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
