import Api from "utils/api.utils";
import {
  apiGetDashboard,
  apiGetDashboardSurveyTicketSummery,
  apiGetDashboardSurveyTicketSummeryExport,
} from "utils/url.constants";

export const fetchDashboardData = async () => {
  const res = await Api.get(apiGetDashboard());
  return res.data;
};

export const fetchDashSurveySummery = async () => {
  const res = await Api.get(apiGetDashboardSurveyTicketSummery());
  return res.data;
};

export const fetchExportSurveyTicketSummery = async () => {
  const res = await Api.get(apiGetDashboardSurveyTicketSummeryExport(), null, {
    responseType: "blob",
  });
  return res.data;
};
