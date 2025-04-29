import { apiService } from "@/api/api_services";
import { endpoints } from "@/api/enpoints";

export const fetchHeader = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.header,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};

export const postHeader = async ({ data, params }) => {
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.header,
        method: "POST",
        data,
        params,
      });
  
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  };
  

export const fetchInternal = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.internal,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};

export const postInternal = async ({ data, params }) => {
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.internal,
        method: "POST",
        data,
        params,
      });
  
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  };

export const fetchServicePage = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.service_page,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};

export const postServicePage = async ({ data, params }) => {
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.service_page,
        method: "POST",
        data,
        params,
      });
  
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  };

export const fetchHome = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.home,
      params,
    });

    return apiResponse;
  } catch (error) {
    console.error(error);
  }
};

export const postHome = async ({ data, params }) => {
    try {
      const apiResponse = await apiService({
        endpoint: endpoints.home,
        method: "POST",
        data,
        params,
      });
  
      return apiResponse;
    } catch (error) {
      console.error(error);
    }
  };