import { getItem } from "@/utils/local_storage";
import { BACKEND_URL } from "../enpoints";
import axios from "axios";
import { getToken } from "@/utils/auth";

export const apiService = async ({
  endpoint,
  method = "GET",
  data,
  params,
  token: _token,
  headers,
  customUrl,
  removeToken = false,
  signal,
}) => {
  try {
    const token = getToken();

    const requestObj = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      params,
      method,
      data,
      signal,
    };

    if (token || _token) {
      // Merge custom headers with the Authorization header
      requestObj.headers = {
        ...headers,
        "ngrok-skip-browser-warning": "xyz",
        ...(!removeToken ? { Authorization: `Bearer ${_token || token}` } : {}),
      };
    }

    const { data: res } = await axios(requestObj);
    return { response: res };
  } catch (error) {
    console.error(error, "backend endpoint error");
    return { success: false, error: true, ...(error || {}) };
  }
};
