export const getHomePath = () => "/";
export const getGeoSurveyPath = () => "/geo/survey";
export const getAreaPocketPath = () => "/area/pocket";
export const getLoginPath = () => "/login";

/* External server apis **/
export const apiGetAreaPocketList = () => "/api/geo/survey/area-pocket/list/";
export const apiPostAreaPocketAdd = () => "/api/geo/survey/area-pocket/add/";
export const apiPutAreaPocketEdit = (areaPocketId) =>
  `/api/geo/survey/area-pocket/${areaPocketId}/edit/`;
export const apiAddArea = () => "/api/area/add/";

export const apiPostLogin = () => "/api/token/";

export const apiGetUserTaskList = () => "/api/task/survey/list/";
