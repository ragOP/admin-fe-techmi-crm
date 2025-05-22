import axios from "axios";
import { BACKEND_URL } from "@/api/enpoints";

export const sendResetLink = async (values) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/admin/forgot-password`,
      values
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
