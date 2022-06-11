import { map } from "lodash";
import Api from "utils/api.utils";
import {
  apiAddUser,
  apiEditUserDetails,
  apiGetApplicationsList,
  apiGetUserDetails,
  apiGetUserList,
  apiUpdateUserRegion,
} from "utils/url.constants";

export const fetchUserList = async () => {
  const res = await Api.get(apiGetUserList());
  return res.data;
};

export const fetchApplicationList = async () => {
  const res = await Api.get(apiGetApplicationsList());
  return res.data;
};

export const addNewUser = async (data) => {
  const postData = {
    ...data,
    confirm_password: undefined,
    access_ids: map(data.access_ids, "value").join(","),
  };
  const res = await Api.post(apiAddUser(), postData);
  return res.data;
};

// data : {
//   "regionIdList": [6,3]
// }
export const updateUserRegion = async ({ data, userId }) => {
  const res = await Api.put(apiUpdateUserRegion(userId), data);
  return res.data;
};

export const fetchUserDetails = async ({ queryKey }) => {
  const [_key, userId] = queryKey;
  const res = await Api.get(apiGetUserDetails(userId));
  return res.data;
};

export const editUserDetails = async ({ data, userId }) => {
  const res = await Api.post(apiEditUserDetails(userId), data);
  return res.data;
};
