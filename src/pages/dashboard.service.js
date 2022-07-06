import Api from "utils/api.utils";
import { apiGetDashboard } from "utils/url.constants";

export const fetchDashboardData = async () => {
  const res = await Api.get(apiGetDashboard());
  return res.data;
};
