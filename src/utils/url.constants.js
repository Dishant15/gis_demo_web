export const getHomePath = () => "/";
export const getGeoSurveyPath = () => "/geo/survey";
export const getAreaPocketPath = () => "/area/pocket";
export const getLoginPath = () => "/login";
export const getRegionPage = () => "/regions";
export const getUserListPage = () => "/users";
export const getAddUserPage = () => "/users/add";

/* External server apis **/

// area pocket apis
export const apiGetAreaPocketList = () => "/api/geo/survey/area-pocket/list/";
export const apiPostAreaPocketAdd = () => "/api/geo/survey/area-pocket/add/";
export const apiPutAreaPocketEdit = (areaPocketId) =>
  `/api/geo/survey/area-pocket/${areaPocketId}/edit/`;

// region apis
export const apiGetRegionList = () => "/api/region/list/";
export const apiPostRegionAdd = () => "/api/region/add/";
export const apiPutRegionEdit = (regionId) => `/api/region/${regionId}/edit/`;
export const apiRegionDelete = (regionId) => `/api/region/${regionId}/delete/`;

export const apiPostLogin = () => "/api/token/";

export const apiGetUserTaskList = () => "/api/task/survey/list/";

export const apiGetUserList = () => "/api/user/list/";
export const apiAddUser = () => "/api/user/list/";

export const apiGetApplicationsList = () => "/api/applications/";
