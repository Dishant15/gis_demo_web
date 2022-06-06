import Api from "utils/api.utils";
import { apiGetApplicationsList, apiGetUserList } from "utils/url.constants";

export const fetchUserList = async () => {
  const res = await Api.get(apiGetUserList());
  return res.data;
};

export const fetchApplicationList = async () => {
  const res = await Api.get(apiGetApplicationsList());
  return res.data;
};
