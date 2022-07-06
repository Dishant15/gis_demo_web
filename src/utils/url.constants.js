export const getHomePath = () => "/";
export const getLoginPath = () => "/login";

export const getGeoSurveyPath = () => "/geo/survey";

export const getRegionPage = () => "/regions";

export const getUserListPage = () => "/users/list";
export const getAddUserPage = () => "/users/add";
export const getEditUserPage = (userId = ":userId") => `/users/edit/${userId}`;

export const getTicketListPage = () => "/ticket/list";
export const getAddTicketPage = () => "/ticket/add";
export const getEditTicketPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/edit`;
export const getTicketWorkorderPage = (ticketId = ":ticketId") =>
  `/ticket/${ticketId}/workorders`;

/* External server apis **/
export const apiGetDashboard = () => "/api/dashboard/";

export const apiPostLogin = () => "/api/token/";
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

// user & Auth apis
export const apiGetUserList = () => "/api/user/list/";
export const apiAddUser = () => "/api/user/add/";
export const apiUpdateUserRegion = (userId) =>
  `/api/user/${userId}/update/regions/`;
export const apiGetUserDetails = (userId) => `/api/user/${userId}/details/`;
export const apiEditUserDetails = (userId) => `/api/user/${userId}/edit/`;

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
// workorder apis
export const apiPutWorkOrderEdit = (workOrderId) =>
  `/api/geo/survey/boundary/${workOrderId}/edit/`;

export const apiPutUnitEdit = (unitId = ":unit_id") =>
  `/api/geo/survey/unit/${unitId}/edit/`;
