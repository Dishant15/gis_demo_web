import Api from "../../utils/api.utils";
import { apiPostLogin } from "../../utils/url.constants";

export const postLogin = async (data) => {
  console.log("🚀 ~ file: services.js ~ line 5 ~ postLogin ~ data", data);
  const res = await Api.post(apiPostLogin(), data);
  return res.data;
};
