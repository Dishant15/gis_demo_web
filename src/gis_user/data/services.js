import trim from "lodash/trim";

import Api from "utils/api.utils";
import {
  apiAddUser,
  apiDeleteUserRole,
  apiEditUserDetails,
  apiEditUserPermission,
  apiGetActiveUserCount,
  apiGetApplicationsList,
  apiGetUserDetails,
  apiGetUserList,
  apiGetUserRoles,
  apiPostUserRoleAdd,
  apiPostUserRoleEdit,
  apiUpdateUserRegion,
  apiUploadExcel,
  apiUserExportExcel,
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

export const updateUserPerm = async ({ data, userId }) => {
  const res = await Api.put(apiEditUserPermission(userId), data);
  return res.data;
};

export const importUser = async (data) => {
  const res = await Api.post(apiUploadExcel(), data);
  return res.data;
};

export const fetchUserRoles = async () => {
  const res = await Api.get(apiGetUserRoles());
  return res.data;
};

export const addUserRole = async (data) => {
  data.name = trim(data.name);
  const res = await Api.post(apiPostUserRoleAdd(), data);
  return res.data;
};

export const updateUserRole = async ({ data, roleId }) => {
  data.name = trim(data.name);
  const res = await Api.put(apiPostUserRoleEdit(roleId), data);
  return res.data;
};

export const deleteUserRole = async (roleId) => {
  const res = await Api.delete(apiDeleteUserRole(roleId));
  return res.data;
};

export const fetchActiveUserCount = async () => {
  const res = await Api.get(apiGetActiveUserCount());
  return res.data;
};

export const fetchExportUser = async () => {
  const res = await Api.get(apiUserExportExcel(), null, {
    responseType: "blob",
  });
  return res.data;
};
