import Api from "utils/api.utils";
import { apiGetRegionList } from "../../utils/url.constants";

export const fetchRegionList = async ({ queryKey }) => {
  const [_key, queryType] = queryKey;
  const res = await Api.get(apiGetRegionList(queryType));
  return res.data;
};
