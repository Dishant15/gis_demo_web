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

export const getTicketListPage = () => "/ticket/list";
export const getAddTicketPage = () => "/ticket/add";
export const getEditTicketPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/edit`;
export const getTicketWorkorderPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/workorders`;

export const getElementConfigPage = () => "/element/config";

export const getPrivacyPolicy = () => "/privacy-policy/";
/* External server apis **/
export const apiGetDashboard = () => "/api/dashboard/";

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
export const apiPutRegionEdit = (regionId) => `/api/region/${regionId}/edit/`;
export const apiRegionDelete = (regionId) => `/api/region/${regionId}/delete/`;
export const apiKmlToCoordinates = () => `/api/region/kml-to-coordinates/`;

// user & Auth apis
export const apiGetUserList = () => "/api/user/list/";
export const apiAddUser = () => "/api/user/add/";
export const apiUploadExcel = () => "/api/user/import-excel/";
export const apiUpdateUserRegion = (userId) =>
  `/api/user/${userId}/update/regions/`;
export const apiGetUserDetails = (userId) => `/api/user/${userId}/details/`;
export const apiEditUserDetails = (userId) => `/api/user/${userId}/edit/`;
export const apiEditUserPermission = (userId) =>
  `/api/user/${userId}/update/permissions/`;

export const apiGetApplicationsList = () => "/api/applications/";

// Ticket apis
export const apiGetTicketList = () => "/api/ticket/list/";
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

export const apiGetElementConnections = (layerKey, elementId) =>
  `/api/planning/layer/${layerKey}/${elementId}/connections/`;

// same api as edit element -> cable edit
export const apiUpdateElementConnections = (cableId) =>
  apiPutEditElement("p_cable", cableId);
