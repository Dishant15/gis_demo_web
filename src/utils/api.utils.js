import axios from "axios";
import { isNil, map, keys, join, get } from "lodash";
// import store from '../store';

export function convertObjectToQueryParams(object) {
  if (!isNil(object)) {
    const paramArray = map(keys(object), (key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(object[key]);
    });
    return "?" + join(paramArray, "&");
  } else {
    return "";
  }
}

export const apiRequestConfig = {
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function (config) {
  // const token = store.getState().auth.token;
  // const token = "";
  // if (config.headers) config.headers.Authorization = token;

  return config;
});

class Api {
  static get(url, queryParams, config = {}) {
    return axiosInstance.get(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }

  static post(url, body, queryParams, config = {}) {
    return axiosInstance.post(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      }
    );
  }

  static put(url, body, queryParams, config = {}) {
    return axiosInstance.put(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      }
    );
  }

  static patch(url, body, queryParams, config = {}) {
    return axiosInstance.patch(
      url + convertObjectToQueryParams(queryParams),
      body,
      {
        ...apiRequestConfig,
        ...config,
      }
    );
  }

  static delete(url, queryParams, config = {}) {
    return axiosInstance.delete(url + convertObjectToQueryParams(queryParams), {
      ...apiRequestConfig,
      ...config,
    });
  }
}

export default Api;

/**
 * Parse axios error and return simple error message
 */
export const parseErrorMessage = (error) => {
  let errorMessage = "Something Went Wrong";
  const status = get(error, "response.status");
  if (status) {
    console.log("err", error.response);
    if (status === 400) {
      errorMessage = get(
        error,
        "response.data.non_field_errors.0",
        "Bad request"
      );
    } else if (status === 403) {
      errorMessage = "Unauthorized";
    }
  } else {
    errorMessage = error.message;
  }
  return errorMessage;
};
