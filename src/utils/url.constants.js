export const getHomePath = () => "/";
export const getLoginPath = () => "/login";

export const getGeoSurveyPath = () => "/geo/survey";
export const getRegionPage = () => "/regions";
export const getPlanningPage = () => "/planning";

export const getPlanningTicketPage = (ticketId) =>
  `/planning?ticketId=${ticketId}`;

export const getUserListPage = () => "/users/list";
export const getAddUserPage = () => "/users/add";
export const getEditUserPage = (userId = ":userId") => `/users/edit/${userId}`;
export const getUserRolePage = () => "/users/roles";
export const getChangePasswordPage = () => "/change-password";

export const getTicketListPage = () => "/ticket/list";
export const getAddTicketPage = () => "/ticket/add";
export const getEditTicketPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/edit`;
export const getTicketWorkorderPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/workorders`;

export const getElementConfigPage = () => "/element/config";

export const getPrivacyPolicy = () => "/privacy-policy/";
export const get404 = () => "/404";

export const getFeedbackLink = () =>
  "https://drive.google.com/drive/folders/1HgHi4fqTuRau8eEKiiC6lgnlVN1FJ2YV?usp=sharing";

/* External server apis **/
export const apiGetDashboard = () => "/api/dashboard/";
export const apiGetDashboardSurveyTicketSummery = () =>
  "/api/survey-ticket-summery/";

export const apiPostLogin = () => "/api/token/";
// area pocket apis
export const apiGetAreaPocketList = () => "/api/geo/survey/area-pocket/list/";
export const apiPostAreaPocketAdd = () => "/api/geo/survey/area-pocket/add/";
export const apiPutAreaPocketEdit = (areaPocketId) =>
  `/api/geo/survey/area-pocket/${areaPocketId}/edit/`;

// region apis

// query_type = detail | data
export const apiGetRegionList = (query_type = "detail") =>
  `/api/region/${query_type}/list/`;
export const apiPostRegionAdd = () => "/api/region/add/";
export const apiGetRegionDetails = (regionId, queryType) =>
  queryType
    ? `/api/region/${regionId}/details/?query_type=${queryType}`
    : `/api/region/${regionId}/details/`;
export const apiPutRegionEdit = (regionId) => `/api/region/${regionId}/edit/`;
export const apiRegionDelete = (regionId) => `/api/region/${regionId}/delete/`;
export const apiKmlToCoordinates = () => `/api/region/kml-to-coordinates/`;

// user & Auth apis
export const apiGetUserList = () => "/api/user/list/";
export const apiPostChangePassword = () => "/api/user/change-password/";
export const apiAddUser = () => "/api/user/add/";
export const apiUploadExcel = () => "/api/user/import-excel/";
export const apiUserExportExcel = () => "/api/user/export-excel/";
export const apiUpdateUserRegion = (userId) =>
  `/api/user/${userId}/update/regions/`;
export const apiGetUserDetails = (userId) => `/api/user/${userId}/details/`;
export const apiEditUserDetails = (userId) => `/api/user/${userId}/edit/`;
export const apiEditUserPermission = (userId) =>
  `/api/user/${userId}/update/permissions/`;
export const apiGetUserRoles = () => "/api/user/roles/";
export const apiPostUserRoleAdd = () => "/api/user/roles/add/";
export const apiPostUserRoleEdit = (roleId) =>
  `/api/user/roles/${roleId}/edit/`;
export const apiDeleteUserRole = (roleId) =>
  `/api/user/roles/${roleId}/delete/`;
export const apiGetActiveUserCount = () => "/api/user/count/";

export const apiGetApplicationsList = () => "/api/applications/";

// Ticket apis
export const apiGetTicketList = () => "/api/ticket/list/";
export const apiGetTicketLayerData = () => "/api/ticket/planning/layer/";
export const apiPostTicketAdd = () => "/api/ticket/add/";
export const apiPostTicketEdit = (ticketId) => `/api/ticket/${ticketId}/edit/`;
export const apiPostTicketEditArea = (ticketId) =>
  `/api/ticket/${ticketId}/edit/area/`;
export const apiGetTicketDetails = (ticketId) =>
  `/api/ticket/${ticketId}/details/`;
export const apiGetTicketWorkorders = (ticketId) =>
  `/api/ticket/${ticketId}/workorders/`;
export const apiExportTicket = (ticketId) => `/api/ticket/${ticketId}/export/`;
export const apiImportTicket = (ticketId) => `/api/ticket/${ticketId}/import/`;
export const apiGetTicketListSummery = () => `/api/ticket/list/summery/`;

// workorder apis
export const apiPutWorkOrderEdit = (workOrderId) =>
  `/api/geo/survey/boundary/${workOrderId}/edit/`;

export const apiPutUnitEdit = (unitId = ":unit_id") =>
  `/api/geo/survey/unit/${unitId}/edit/`;

// planning apis
export const apiGetPlanningConfigs = () => "/api/planning/configs/";
export const apiGetPlanningConfigsDetails = () =>
  "/api/planning/configs/details/";
export const apiGetPlanningLayerData = () => "/api/planning/layer/";

export const apiPostValidateElementGeometry = () =>
  "/api/planning/layer/validate/geometry/";
export const apiPostAddElement = (layerKey) =>
  `/api/planning/layer/${layerKey}/add/`;

export const apiGetElementDetails = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/details/`;

export const apiPutEditElement = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/edit/`;

export const apiGetTicketWorkorderElements = (ticketId = ":ticketId") =>
  `/api/ticket/${ticketId}/workorders/elements/`;

export const apiPutTicketWorkorderEdit = (workOrderId) =>
  `/api/ticket/workorder/${workOrderId}/edit/`;
// layer config api
export const apiGetLayerConfigList = (layerKey = ":layer_key") =>
  `/api/layer/config/${layerKey}/list/`;

export const apiPostLayerConfigAdd = (layerKey = ":layer_key") =>
  `/api/layer/config/${layerKey}/add/`;

export const apiPutLayerConfigEdit = (
  layerKey = ":layer_key",
  configId = ":config_id"
) => `/api/layer/config/${layerKey}/${configId}/edit/`;

export const apiDeleteLayerConfig = (
  layerKey = ":layer_key",
  configId = ":config_id"
) => `/api/layer/config/${layerKey}/${configId}/delete/`;

export const apiGetLayerPortConfig = (
  layerKey = ":layer_key",
  configId = ":config_id"
) => `/api/layer/port/config/${layerKey}/${configId}/`;

export const apiGetElementConnections = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/connections/`;

// same api as edit element -> cable edit
export const apiUpdateElementConnections = (cableId) =>
  apiPutEditElement("p_cable", cableId);

export const apiGetElementAssociations = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/associations/`;

export const getGoogleAddress = (long, lat) =>
  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
