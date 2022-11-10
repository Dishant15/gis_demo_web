import Api from "utils/api.utils";
import {
  apiGetRegionDetails,
  apiGetRegionList,
  apiKmlToCoordinates,
} from "../../utils/url.constants";

export const fetchRegionList = async ({ queryKey }) => {
  const [_key, queryType] = queryKey;
  const res = await Api.get(apiGetRegionList(queryType));
  return res.data;
};

export const fetchRegionDetails = async ({ queryKey }) => {
  const [_key, regionId] = queryKey;
  const res = await Api.get(apiGetRegionDetails(regionId));
  return res.data;
};

export const uploadKml = async (data) => {
  const res = await Api.post(apiKmlToCoordinates(), data, null, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
  return res.data;
};
