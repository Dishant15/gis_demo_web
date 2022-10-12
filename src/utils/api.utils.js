import axios from "axios";
import store from "redux/store";
import { format } from "date-fns";
import { isNil, map, keys, join, get } from "lodash";

import { addNotification } from "redux/reducers/notification.reducer";
import { handleLogoutUser } from "redux/actions/auth.actions";

export function convertObjectToQueryParams(object) {
  if (!isNil(object)) {
    const paramArray = map(keys(object), (key) => {
      return key + "=" + object[key];
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
  const token = store.getState().auth.token;
  if (config.headers)
    config.headers.Authorization = token ? `Bearer ${token}` : undefined;

  return config;
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const token = store.getState().auth.token;
    // dispatch logout action if request unauthorised.
    const status = get(error, "response.status");
    if (status === 401 && !!token) {
      store.dispatch(handleLogoutUser);
      // fire notification
    }
    return Promise.reject(error);
  }
);

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

export const parseBadRequest = (error) => {
  const status = get(error, "response.status");
  if (status === 400) {
    return get(error, "response.data");
  }
  return false;
};

/**
 *
 * @param {*} date - Date object
 *
 * retutn formated django accepted date in String
 */
export const formatSubmitDate = (date) => {
  return format(date, "yyyy-MM-dd HH:mm:ssxxx");
};

export const parseErrorMessagesWithFields = (error) => {
  let msgList = [];
  let fieldList = [];
  const status = get(error, "response.status");

  if (status) {
    if (status === 400) {
      const errorData = get(error, "response.data", {});
      fieldList = [];
      msgList = [];
      for (const key in errorData) {
        if (Object.hasOwnProperty.call(errorData, key)) {
          const errorList = errorData[key];
          if (key === "__all__") {
            store.dispatch(
              addNotification({
                type: "error",
                title: "Input Error",
                text: get(errorList, 0, "Undefined Error"),
                timeout: 10000,
              })
            );
          } else {
            fieldList.push(key);
            msgList.push(get(errorList, 0, "Undefined Error"));
          }
        }
      }
    } else if (status === 403) {
      store.dispatch(
        addNotification({
          type: "error",
          title: "Unauthorized",
          timeout: 10000,
        })
      );
    }
  } else {
    store.dispatch(
      addNotification({
        type: "error",
        title: "Something Went Wrong",
        timeout: 10000,
      })
    );
  }

  return { fieldList, messageList: msgList };
};
