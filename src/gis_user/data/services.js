import Api from "utils/api.utils";
import { apiGetUserList } from "utils/url.constants";

export const fetchUserList = async () => {
  const res = await Api.get(apiGetUserList());
  return res.data;
};
