import Api from "utils/api.utils";
// test api:

export const fetchGeoSurveyBoundaryList = async () => {
  const res = await Api.get("/api/geo/survey/list/");
  return res.data;
};
