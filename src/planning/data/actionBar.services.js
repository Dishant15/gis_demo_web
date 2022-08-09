import Api from "utils/api.utils";
import { apiGetRegionList } from "../../utils/url.constants";

export const fetchRegionList = async () => {
  const res = await Api.get(apiGetRegionList("data"));
  return res.data;
};
