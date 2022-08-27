import Api from "utils/api.utils";
import { apiGetElementList } from "utils/url.constants";

export const fetchElementList = async ({ queryKey }) => {
  const res = await Api.get(apiGetElementList(queryKey[1]));
  return res.data;
};
