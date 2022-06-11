import Api from "utils/api.utils";
import { apiPostLogin } from "utils/url.constants";

export const postLogin = async (data) => {
  const res = await Api.post(apiPostLogin(), data);
  return res.data;
};
