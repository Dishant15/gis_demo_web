import { apiGetAreaPocketList } from "../../utils/url.constants";
import Api from "../../utils/api.utils";

export const fetchAreaPockets = async () => {
  const res = await Api.get(apiGetAreaPocketList());
  return res.data;
};
