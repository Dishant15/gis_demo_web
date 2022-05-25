import Api from "../../utils/api.utils";
import { apiGetUserTaskList } from "../../utils/url.constants";

export const fetchUserTasks = async () => {
  const res = await Api.get(apiGetUserTaskList());
  return res.data;
};
