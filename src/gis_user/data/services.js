import { map } from "lodash";
import Api from "utils/api.utils";
import {
  apiAddUser,
  apiGetApplicationsList,
  apiGetUserList,
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
