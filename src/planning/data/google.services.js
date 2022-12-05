import Api from "utils/api.utils";
import { getGoogleAddress } from "utils/url.constants";

export const fetchGoogleAddressFromLatLong = async (long, lat) => {
  const res = await Api.get(getGoogleAddress(long, lat), null, {
    withCredentials: false,
    skipAuthorization: true,
  });
  return res.data;
};
