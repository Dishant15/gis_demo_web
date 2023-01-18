import Api from "utils/api.utils";
import { apiGetHealthCheck } from "utils/url.constants";

export const fetchHealthCheck = async () => {
  const res = await Api.get(apiGetHealthCheck());
  return res.data;
};
