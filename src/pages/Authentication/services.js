import Api from "utils/api.utils";
import {
  apiPostChangePassword,
  apiPostLogin,
  apiPostProfileEdit,
} from "utils/url.constants";

export const postLogin = async (data) => {
  const res = await Api.post(apiPostLogin(), data);
  return res.data;
};

export const postChangePassword = async (data) => {
  const res = await Api.post(apiPostChangePassword(), data);
  return res.data;
};

export const postProfileEdit = async (data) => {
  const res = await Api.post(apiPostProfileEdit(), data);
  return res.data;
};
