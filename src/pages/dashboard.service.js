import Api from "utils/api.utils";
import {
  apiGetDashboard,
  apiGetDashboardSurveyTicketSummery,
} from "utils/url.constants";

export const fetchDashboardData = async () => {
  const res = await Api.get(apiGetDashboard());
  return res.data;
};

export const fetchSurveyTicketSummery = async () => {
  const res = await Api.get(apiGetDashboardSurveyTicketSummery());
  return res.data;
};
